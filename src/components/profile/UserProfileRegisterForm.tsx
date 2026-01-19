"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FormField from "@/components/form/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileCreateSchema } from "@/libs/validation/profileSchemas";
import { z } from "zod";
import { parseServerError } from "@/utils/parseServerError";
import { REGIONS, SERVICE_CATEGORIES } from "@/constants/profile.constants";
import ProfileChips from "@/components/common/ProfileChips";
import { useRouter } from "next/navigation";
import {
  useDeleteFileFromS3,
  useGetPresignedUrl,
  useUploadToS3,
} from "@/hooks/useFileService";
import { usePostProfile } from "@/hooks/useProfile";
import { useI18n } from "@/libs/i18n/I18nProvider";

const DEFAULT_PROFILE_IMAGE = "/assets/image/upload-default.png";

// USER 프로필 생성 스키마 타입
type UserProfileCreateValues = z.infer<ReturnType<typeof profileCreateSchema>>;

/**
 * 일반유저 프로필 등록 폼
 * @returns
 */
export default function UserProfileRegisterForm() {
  const { t } = useI18n();
  const router = useRouter();

  // 프로필 등록 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields, isValid },
    setError,
    clearErrors,
    setValue,
  } = useForm<UserProfileCreateValues>({
    resolver: zodResolver(profileCreateSchema("USER")),
    mode: "all",
  });

  // 서비스 카테고리 목록
  const serviceCategories = SERVICE_CATEGORIES;
  // 지역 목록
  const regions = REGIONS;

  // 프로필 등록 mutation 준비
  const postProfileMutation = usePostProfile();
  // 파일 관련 mutations 준비
  const getPresignedUrlMutation = useGetPresignedUrl();
  const uploadToS3Mutation = useUploadToS3();
  const deleteFileMutation = useDeleteFileFromS3();

  // 프로필 이미지 미리보기용 state
  const [previewImage, setPreviewImage] = useState<string>(
    DEFAULT_PROFILE_IMAGE
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  // 파일 input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setPreviewImage(DEFAULT_PROFILE_IMAGE);
      setSelectedFile(null);
      setUploadedFileKey(null);
      setValue("profileImage", "");
      setError("profileImage", {
        type: "required",
        message: t("profile_image_upload_error"),
      });
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
    // (같은 파일 재선택 시 onChange가 발생하지 않는 HTML input 특성 해결)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  // 프로필 등록 제출 핸들러
  const onSubmit = async (data: UserProfileCreateValues) => {
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
        fileKey = uploadedFileKey!;
      }

      data.profileImage = fileKey;

      await postProfileMutation.mutateAsync(data);
    } catch (error) {
      // S3 업로드는 완료 but 프로필 등록 실패 경우 롤백
      if (selectedFile && data.profileImage) {
        try {
          await deleteFileMutation.mutateAsync(data.profileImage);
          console.log("프로필 등록 실패로 인한 이미지 롤백 완료");
        } catch (rollbackError) {
          const parsedRollbackError = parseServerError(rollbackError);
          console.error("이미지 롤백 실패:", {
            status: parsedRollbackError?.status,
            message: parsedRollbackError?.message,
            details: parsedRollbackError?.details,
            fullError: rollbackError,
          });
        }
        setUploadedFileKey(null);
        setSelectedFile(null);
        setPreviewImage(DEFAULT_PROFILE_IMAGE);
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl);
          setPreviewObjectUrl(null);
        }
      }

      // 서버 에러 파싱
      const parsed = parseServerError(error);

      if (!parsed) {
        alert(t("profile_register_error"));
        return;
      }

      const { code, status, message } = parsed;

      // 프로필 이미 존재 에러
      if (status === 409 || code === "PROFILE_ALREADY_EXISTS") {
        alert(message || t("profile_register_already_exists"));
        router.push("/");
        return;
      }

      alert(message || t("profile_register_error_unknown"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-12"
    >
      {/* 일반회원 프로필 등록: 항상 1단 */}
      <>
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
          label={t("profile_service_label")}
          register={register("serviceCategories")}
          error={errors.serviceCategories}
          placeholder={t("service")}
          touched={!!touchedFields.serviceCategories}
        >
          <ProfileChips
            chipList={serviceCategories}
            register={register("serviceCategories")}
            content={t("profile_service_chip_info")}
          />
        </FormField>
        <FormField
          label={t("profile_region_label")}
          register={register("region")}
          error={errors.region}
          placeholder={t("region")}
          touched={!!touchedFields.region}
        >
          <ProfileChips
            chipList={regions}
            register={register("region")}
            content={t("profile_region_chip_info")}
          />
        </FormField>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? t("profile_register_submitting") : t("profile_register_submit")}
          </button>
        </div>
      </>
    </form>
  );
}
