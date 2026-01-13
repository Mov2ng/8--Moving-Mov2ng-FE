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

const DEFAULT_PROFILE_IMAGE = "/assets/image/upload-default.png";

interface DriverProfileFormProps {
  mode: "create" | "edit";
  initialData?: {
    profileImage?: string;
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
    resolver: zodResolver(profileSchema("DRIVER")),
    mode: "all",
    defaultValues: mode === "edit" && initialData ? {
      profileImage: initialData.profileImage || "",
      nickname: initialData.nickname || "",
      driverYears: initialData.driverYears || 0,
      driverIntro: initialData.driverIntro || "",
      driverContent: initialData.driverContent || "",
      serviceCategories: initialData.serviceCategories || [],
      region: initialData.region || [],
    } : undefined,
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
    initialData?.profileImage || null
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

    // 파일이 선택되지 않은 경우
    if (!file) {
      setPreviewImage(mode === "edit" && initialData?.profileImage ? initialData.profileImage : DEFAULT_PROFILE_IMAGE);
      setSelectedFile(null);
      setUploadedFileKey(mode === "edit" && initialData?.profileImage ? initialData.profileImage : null);
      setValue("profileImage", mode === "edit" && initialData?.profileImage ? initialData.profileImage : "");
      if (!initialData?.profileImage) {
        setError("profileImage", {
          type: "required",
          message: "프로필 이미지를 업로드해주세요.",
        });
      }
      return;
    }

    // 파일 선택 시 미리보기 표시
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setPreviewObjectUrl(objectUrl);
    setSelectedFile(file);
    setUploadedFileKey(null);
    setValue("profileImage", "");
    clearErrors("profileImage");
  };

  // Image 클릭 핸들러
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: ProfileFormValues) => {
    // 프로필 이미지 최종 검증
    if (!selectedFile && !uploadedFileKey) {
      setError("profileImage", {
        type: "required",
        message: "프로필 이미지를 업로드해주세요.",
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
            await getPresignedUrlMutation.mutateAsync({
              fileName: selectedFile.name,
              category: "PROFILE",
              contentType,
            });

          await uploadToS3Mutation.mutateAsync({
            presignedUrl,
            file: selectedFile,
            contentType,
          });

          fileKey = uploadedKey;
          setUploadedFileKey(fileKey);
        } catch (error) {
          console.error("파일 업로드 실패:", error);
          setError("profileImage", {
            type: "upload",
            message:
              error instanceof Error
                ? error.message
                : "파일 업로드에 실패했습니다. 다시 시도해주세요.",
          });
          return;
        }
      } else {
        // 기존 파일 사용
        fileKey = uploadedFileKey!;
      }

      data.profileImage = fileKey;

      await handleSubmitProp(data);
    } catch (error) {
      // S3 업로드는 완료 but 프로필 등록/수정 실패 경우 롤백
      if (selectedFile && data.profileImage) {
        try {
          await deleteFileMutation.mutateAsync(data.profileImage);
          console.log("프로필 등록/수정 실패로 인한 이미지 롤백 완료");
        } catch (rollbackError) {
          console.error("이미지 롤백 실패:", rollbackError);
        }
        setUploadedFileKey(null);
        setSelectedFile(null);
        setPreviewImage(mode === "edit" && initialData?.profileImage ? initialData.profileImage : DEFAULT_PROFILE_IMAGE);
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl);
          setPreviewObjectUrl(null);
        }
      }

      // 서버 에러 파싱
      const parsed = parseServerError(error);

      if (!parsed) {
        alert(mode === "create" ? "프로필 등록 중 오류가 발생했습니다." : "프로필 수정 중 오류가 발생했습니다.");
        return;
      }

      const { code, status, message } = parsed;

      if (status === 409 || code === "PROFILE_ALREADY_EXISTS") {
        alert(message || "프로필이 이미 등록되어 있습니다.");
        if (mode === "create") {
          router.push("/");
        }
        return;
      }

      alert(message || (mode === "create" ? "프로필 등록 중 알 수 없는 오류가 발생했습니다." : "프로필 수정 중 알 수 없는 오류가 발생했습니다."));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 기사님 프로필 등록/수정: PC에서는 2단, 모바일/태블릿에서는 1단 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-between">
        {/* 왼쪽 열: 프로필 이미지, 별명, 경력, 한줄 소개 */}
        <div className="flex flex-col gap-6">
          <FormField
            label="프로필 이미지"
            type="file"
            register={register("profileImage")}
            error={errors.profileImage}
            touched={!!touchedFields.profileImage}
            placeholder="프로필 이미지"
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
            label="별명"
            type="text"
            register={register("nickname")}
            error={errors.nickname}
            placeholder="별명"
            touched={!!touchedFields.nickname}
          />
          <FormField
            label="경력"
            register={register("driverYears", { valueAsNumber: true })}
            error={errors.driverYears}
            touched={!!touchedFields.driverYears || !!errors.driverYears}
          >
            <div className="flex items-center gap-2">
              <TextInput
                register={register("driverYears", { valueAsNumber: true })}
                placeholder="경력"
                error={
                  isFieldError(errors.driverYears)
                    ? errors.driverYears
                    : undefined
                }
                touched={!!touchedFields.driverYears}
                type="number"
              />
              <span>년</span>
            </div>
          </FormField>
          <FormField
            label="한 줄 소개"
            type="textarea"
            register={register("driverIntro")}
            error={errors.driverIntro}
            placeholder="한 줄 소개"
            touched={!!touchedFields.driverIntro}
          />
        </div>

        {/* 오른쪽 열: 상세 설명, 제공 서비스, 서비스 가능 지역 */}
        <div className="flex flex-col gap-6">
          <FormField
            label="상세 설명"
            type="textarea"
            register={register("driverContent")}
            error={errors.driverContent}
            placeholder="상세 설명"
            touched={!!touchedFields.driverContent}
          />
          <FormField
            label="제공 서비스"
            register={register("serviceCategories")}
            error={errors.serviceCategories}
            placeholder="서비스"
            touched={!!touchedFields.serviceCategories}
          >
            <ProfileChips
              chipList={serviceCategories}
              register={register("serviceCategories")}
            />
          </FormField>
          <FormField
            label="서비스 가능 지역"
            register={register("region")}
            error={errors.region}
            placeholder="지역"
            touched={!!touchedFields.region}
          >
            <ProfileChips
              chipList={regions}
              register={register("region")}
            />
          </FormField>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting
                ? mode === "create"
                  ? "프로필 등록 중..."
                  : "프로필 수정 중..."
                : mode === "create"
                  ? "시작하기"
                  : "수정하기"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

