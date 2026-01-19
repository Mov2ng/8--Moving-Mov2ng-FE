"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FormField, { isFieldError } from "@/components/form/FormField";
import TextInput from "@/components/form/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormValues,
  profileSchema,
  profileCreateSchema,
} from "@/libs/validation/profileSchemas";
import { parseServerError } from "@/utils/parseServerError";
import { REGIONS, SERVICE_CATEGORIES } from "@/constants/profile.constants";
import ProfileChips from "@/components/common/ProfileChips";
import { useRouter } from "next/navigation";
import {
  useDeleteFileFromS3,
  useGetPresignedUrl,
  useUploadToS3,
} from "@/hooks/useFileService";
import { useI18n } from "@/libs/i18n/I18nProvider";

const DEFAULT_PROFILE_IMAGE = "/assets/image/upload-default.png";

interface DriverProfileFormProps {
  mode: "create" | "edit";
  initialData?: {
    profileImage?: string; // presigned URL (화면 표시용)
    profileImageKey?: string; // fileKey (비교용, edit 모드에서만 사용)
    nickname?: string;
    driverYears?: number;
    driverIntro?: string;
    driverContent?: string;
    serviceCategories?: string[];
    region?: string[];
  };
  onSubmit: (data: ProfileFormValues) => Promise<void>;
}

/**
 * DriverProfileForm: 기사님 프로필 등록/수정 폼
 * @param mode - 모드 ("create" | "edit")
 * @param initialData - 초기 데이터
 * @param onSubmit - 폼 제출 핸들러
 * @returns
 */
export default function DriverProfileForm({
  mode,
  initialData,
  onSubmit: handleSubmitProp,
}: DriverProfileFormProps) {
  const { t } = useI18n();
  const router = useRouter();

  // 프로필 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields, isValid },
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(
      mode === "create"
        ? profileCreateSchema("DRIVER")
        : profileSchema("DRIVER")
    ),
    mode: "all",
    defaultValues:
      mode === "edit" && initialData
        ? {
            profileImage: initialData.profileImage || "",
            nickname: initialData.nickname || "",
            driverYears: initialData.driverYears || 0,
            driverIntro: initialData.driverIntro || "",
            driverContent: initialData.driverContent || "",
            serviceCategories: initialData.serviceCategories || [],
            region: initialData.region || [],
          }
        : undefined,
  });

  // 서비스 카테고리 목록
  const serviceCategories = SERVICE_CATEGORIES;
  // 지역 목록
  const regions = REGIONS;

  // 파일 관련 mutations 준비
  const getPresignedUrlMutation = useGetPresignedUrl();
  const uploadToS3Mutation = useUploadToS3();
  const deleteFileMutation = useDeleteFileFromS3();

  // 프로필 이미지 미리보기용 state
  const initialImageUrl = initialData?.profileImage || DEFAULT_PROFILE_IMAGE;
  const [previewImage, setPreviewImage] = useState<string>(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(
    initialData?.profileImageKey || null // fileKey (비교용)
  );
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  // 파일 input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기 데이터 설정 (수정 모드)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      if (initialData.profileImage) {
        // S3 URL로 변환 필요 시 여기서 처리
        setPreviewImage(initialData.profileImage);
      }
    }
  }, [mode, initialData]);

  // 컴포넌트 언마운트 시 previewObjectUrl 정리
  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  // 프로필 이미지 선택 핸들러
  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // 이전 object URL 정리
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      setPreviewObjectUrl(null);
    }

    // 파일이 선택되지 않은 경우 early return
    if (!file) {
      return;
    }

    // 파일 선택 시 미리보기 표시
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setPreviewObjectUrl(objectUrl);
    setSelectedFile(file);
    setUploadedFileKey(null);
    // 파일이 선택되었음을 나타내는 임시 값 설정 (zod 검증 통과를 위해)
    setValue("profileImage", "file-selected", { shouldValidate: true });
    clearErrors("profileImage");
  };

  // Image 클릭 핸들러
  const handleImageClick = () => {
    // 등록 모드에서는 같은 파일도 재선택 가능하도록 input value 초기화
    // (수정 모드에서는 같은 파일 재선택 시 변경사항 없음으로 처리하는 방어 로직 유지)
    if (mode === "create" && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: ProfileFormValues) => {
    // 프로필 이미지 최종 검증
    if (!selectedFile && !uploadedFileKey) {
      setError("profileImage", {
        type: "required",
        message: t("profile_image_upload_error"),
      });
      return;
    }

    try {
      let fileKey: string;

      // 프로필 이미지 처리
      if (selectedFile) {
        // 새 파일이 선택된 경우
        try {
          const contentType = selectedFile.type || "image/jpeg";
          const { presignedUrl, fileKey: uploadedKey } =
            // fileKey 받아오기
            await getPresignedUrlMutation.mutateAsync({
              fileName: selectedFile.name,
              category: "PROFILE",
              contentType,
            });

          // S3 업로드
          await uploadToS3Mutation.mutateAsync({
            presignedUrl,
            file: selectedFile,
            contentType,
          });

          fileKey = uploadedKey;
          setUploadedFileKey(fileKey); // fileKey 저장
        } catch (error) {
          const parsedError = parseServerError(error);
          console.error("파일 업로드 실패:", {
            status: parsedError?.status,
            message: parsedError?.message,
            details: parsedError?.details,
            fullError: error,
          });
          setError("profileImage", {
            type: "upload",
            message:
              parsedError?.message ||
              (error instanceof Error
                ? error.message
                : t("profile_image_upload_fail")),
          });
          return;
        }
      } else {
        // 기존 파일 사용
        fileKey = uploadedFileKey!;
      }

      // create 모드: 모든 필드 전송
      // edit 모드: 변경된 필드만 전송
      if (mode === "create") {
        data.profileImage = fileKey;
        await handleSubmitProp(data);
      } else {
        // edit 모드: 변경된 필드만 포함한 데이터 생성
        const submitData: any = {};

        // 프로필 이미지: 새 파일이 선택되었거나 변경된 경우
        if (selectedFile) {
          // 새 파일이 선택된 경우 무조건 변경된 것으로 간주
          submitData.profileImage = fileKey;
        } else if (fileKey && fileKey !== initialData?.profileImageKey) {
          // 기존 파일이지만 fileKey가 초기값과 다른 경우 변경된 것으로 간주
          submitData.profileImage = fileKey;
        }

        // 별명: 변경된 경우
        if (data.nickname && data.nickname !== initialData?.nickname) {
          submitData.nickname = data.nickname;
        }

        // 경력: 변경된 경우
        if (
          data.driverYears !== undefined &&
          data.driverYears !== initialData?.driverYears
        ) {
          submitData.driverYears = data.driverYears;
        }

        // 한 줄 소개: 변경된 경우
        if (data.driverIntro && data.driverIntro !== initialData?.driverIntro) {
          submitData.driverIntro = data.driverIntro;
        }

        // 상세 설명: 변경된 경우
        if (
          data.driverContent &&
          data.driverContent !== initialData?.driverContent
        ) {
          submitData.driverContent = data.driverContent;
        }

        // 서비스 카테고리: 변경된 경우 (배열 비교)
        if (data.serviceCategories !== undefined) {
          const initialServiceCategories = initialData?.serviceCategories || [];
          const hasServiceCategoriesChanged =
            JSON.stringify([...data.serviceCategories].sort()) !==
            JSON.stringify([...initialServiceCategories].sort());
          if (
            hasServiceCategoriesChanged &&
            data.serviceCategories.length > 0
          ) {
            submitData.serviceCategories = data.serviceCategories;
          }
        }

        // 지역: 변경된 경우 (배열 비교)
        if (data.region !== undefined) {
          const initialRegion = initialData?.region || [];
          const hasRegionChanged =
            JSON.stringify([...data.region].sort()) !==
            JSON.stringify([...initialRegion].sort());
          if (hasRegionChanged && data.region.length > 0) {
            submitData.region = data.region;
          }
        }

        await handleSubmitProp(submitData);
      }
    } catch (error) {
      // S3 업로드는 완료 but 프로필 등록/수정 실패 경우 롤백
      if (selectedFile && data.profileImage) {
        try {
          await deleteFileMutation.mutateAsync(data.profileImage);
          console.log("프로필 등록/수정 실패로 인한 이미지 롤백 완료");
        } catch (rollbackError) {
          const parsedRollbackError = parseServerError(rollbackError);
          console.error("이미지 롤백 실패:", {
            status: parsedRollbackError?.status,
            message: parsedRollbackError?.message,
            details: parsedRollbackError?.details,
            fullError: rollbackError,
          });
        }
        setUploadedFileKey(null); // fileKey 정리
        setSelectedFile(null); // 파일 선택 정리
        setPreviewImage(
          mode === "edit" && initialData?.profileImage
            ? initialData.profileImage
            : DEFAULT_PROFILE_IMAGE
        ); // 프로필 이미지 미리보기 정리
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl); // previewObjectUrl 정리
          setPreviewObjectUrl(null); // previewObjectUrl 정리
        }
      }

      // 서버 에러 파싱
      const parsed = parseServerError(error);

      if (!parsed) {
        alert(
          mode === "create"
            ? t("profile_register_error")
            : t("profile_edit_error")
        );
        return;
      }

      const { code, status, message } = parsed;

      if (status === 409 || code === "PROFILE_ALREADY_EXISTS") {
        alert(message || t("profile_register_already_exists"));
        if (mode === "create") {
          router.push("/");
        }
        return;
      }

      alert(
        message ||
          (mode === "create"
            ? t("profile_register_error_unknown")
            : t("profile_edit_error_unknown"))
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 기사님 프로필 등록/수정: PC에서는 2단, 모바일/태블릿에서는 1단 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-between">
        {/* 왼쪽 열: 프로필 이미지, 별명, 경력, 한줄 소개 */}
        <div className="flex flex-col gap-6">
          <FormField
            label={t("profile_image")}
            type="file"
            register={register("profileImage")}
            error={errors.profileImage}
            touched={!!touchedFields.profileImage}
            placeholder={t("profile_image_placeholder")}
          >
            <div className="relative">
              <Image
                src={previewImage}
                alt="profile image preview"
                width={100}
                height={100}
                onClick={handleImageClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleImageClick();
                  }
                }}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageSelect}
                className="hidden"
              />
            </div>
          </FormField>
          <FormField
            label={t("profile_nickname")}
            type="text"
            register={register("nickname")}
            error={errors.nickname}
            placeholder={t("profile_nickname_placeholder")}
            touched={!!touchedFields.nickname}
          />
          <FormField
            label={t("profile_experience")}
            register={register("driverYears", { valueAsNumber: true })}
            error={errors.driverYears}
            touched={!!touchedFields.driverYears || !!errors.driverYears}
          >
            <div className="flex items-center gap-2">
              <TextInput
                register={register("driverYears", { valueAsNumber: true })}
                placeholder={t("profile_experience_placeholder")}
                error={
                  isFieldError(errors.driverYears)
                    ? errors.driverYears
                    : undefined
                }
                touched={!!touchedFields.driverYears}
                type="number"
              />
              <span>{t("profile_experience_year")}</span>
            </div>
          </FormField>
          <FormField
            label={t("profile_intro")}
            type="textarea"
            register={register("driverIntro")}
            error={errors.driverIntro}
            placeholder={t("profile_intro_placeholder")}
            touched={!!touchedFields.driverIntro}
          />
        </div>

        {/* 오른쪽 열: 상세 설명, 제공 서비스, 서비스 가능 지역 */}
        <div className="flex flex-col gap-6">
          <FormField
            label={t("profile_content")}
            type="textarea"
            register={register("driverContent")}
            error={errors.driverContent}
            placeholder={t("profile_content_placeholder")}
            touched={!!touchedFields.driverContent}
          />
          <FormField
            label={t("profile_driver_service_label")}
            register={register("serviceCategories")}
            error={errors.serviceCategories}
            placeholder={t("service")}
            touched={!!touchedFields.serviceCategories}
          >
            <ProfileChips
              chipList={serviceCategories}
              register={register("serviceCategories")}
            />
          </FormField>
          <FormField
            label={t("profile_driver_region_label")}
            register={register("region")}
            error={errors.region}
            placeholder={t("region")}
            touched={!!touchedFields.region}
          >
            <ProfileChips chipList={regions} register={register("region")} />
          </FormField>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting
                ? mode === "create"
                  ? t("profile_register_submitting")
                  : t("profile_edit_submitting")
                : mode === "create"
                ? t("profile_register_submit")
                : t("profile_edit_submit")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
