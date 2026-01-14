"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FormField, { isFieldError } from "@/components/form/FormField";
import PasswordInput from "@/components/form/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userIntegrationSchema,
  UserIntegrationFormValues,
} from "@/libs/validation/userIntegrationSchemas";
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

interface UserProfileEditFormProps {
  initialData?: {
    // 기본정보
    name?: string;
    email?: string;
    phoneNum?: string;
    // 프로필
    profileImage?: string; // presigned URL (화면 표시용)
    profileImageKey?: string; // fileKey (비교용)
    serviceCategories?: string[];
    region?: string[];
  };
  onSubmit: (data: UserIntegrationFormValues) => Promise<void>;
}

// 일반유저 프로필 수정 폼 타입 (기본정보 + 프로필 통합)
type UserProfileEditFormValues = UserIntegrationFormValues;

/**
 * UserProfileEditForm: 일반유저 프로필 수정 폼
 * @param initialData - 초기 데이터
 * @returns
 */
export default function UserProfileEditForm({
  initialData,
  onSubmit: handleSubmitProp,
}: UserProfileEditFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields, isValid },
    setError,
    clearErrors,
    setValue,
  } = useForm<UserProfileEditFormValues>({
    resolver: zodResolver(userIntegrationSchema),
    mode: "all",
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          phoneNum: initialData.phoneNum || "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
          profileImage: initialData.profileImage || "",
          serviceCategories: initialData.serviceCategories || [],
          region: initialData.region || [],
        }
      : undefined,
  });

  // 서비스 카테고리 목록
  const serviceCategories = SERVICE_CATEGORIES;
  // 지역 목록
  const regions = REGIONS;

  // 파일 관련 mutations
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

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData?.profileImage) {
      setPreviewImage(initialData.profileImage);
    }
  }, [initialData]);

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
      setPreviewImage(initialData?.profileImage || DEFAULT_PROFILE_IMAGE);
      setSelectedFile(null);
      setUploadedFileKey(initialData?.profileImage || null);
      setValue("profileImage", initialData?.profileImage || "");
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
  const onSubmit = async (data: UserProfileEditFormValues) => {
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

      // 변경된 필드만 포함한 데이터 생성
      const submitData: any = {};

      // 프로필 이미지: 새 파일이 선택되었거나 변경된 경우
      if (selectedFile) {
        // 새 파일이 선택된 경우 무조건 변경된 것으로 간주
        submitData.profileImage = fileKey;
      } else if (fileKey && fileKey !== initialData?.profileImageKey) {
        // 기존 파일이지만 fileKey가 초기값과 다른 경우 변경된 것으로 간주
        submitData.profileImage = fileKey;
      }

      // 이름: 변경된 경우
      if (data.name && data.name !== initialData?.name) {
        submitData.name = data.name;
      }

      // 전화번호: 변경된 경우
      if (data.phoneNum && data.phoneNum !== initialData?.phoneNum) {
        submitData.phoneNum = data.phoneNum;
      }

      // 서비스 카테고리: 변경된 경우 (배열 비교)
      if (data.serviceCategories !== undefined) {
        const initialServiceCategories = initialData?.serviceCategories || [];
        const hasServiceCategoriesChanged =
          JSON.stringify([...data.serviceCategories].sort()) !==
          JSON.stringify([...initialServiceCategories].sort());
        if (hasServiceCategoriesChanged && data.serviceCategories.length > 0) {
          submitData.serviceCategories = data.serviceCategories;
        }
      }

      // 지역 카테고리: 변경된 경우 (배열 비교)
      if (data.region !== undefined) {
        const initialRegion = initialData?.region || [];
        const hasRegionChanged =
          JSON.stringify([...data.region].sort()) !==
          JSON.stringify([...initialRegion].sort());
        if (hasRegionChanged && data.region.length > 0) {
          submitData.region = data.region;
        }
      }

      // 비밀번호가 입력된 경우에만 비밀번호 필드 추가
      if (data.currentPassword && data.newPassword && data.newPasswordConfirm) {
        submitData.currentPassword = data.currentPassword;
        submitData.newPassword = data.newPassword;
        submitData.newPasswordConfirm = data.newPasswordConfirm;
      }

      // handleSubmitProp에 전달 (UserProfileEditContainer의 handleSubmit에서 API 호출)
      await handleSubmitProp(submitData);
    } catch (error) {
      // S3 업로드는 완료 but 프로필 수정 실패 경우 롤백
      if (selectedFile && data.profileImage) {
        try {
          await deleteFileMutation.mutateAsync(data.profileImage);
          console.log("프로필 수정 실패로 인한 이미지 롤백 완료");
        } catch (rollbackError) {
          console.error("이미지 롤백 실패:", rollbackError);
        }
        setUploadedFileKey(null);
        setSelectedFile(null);
        setPreviewImage(initialData?.profileImage || DEFAULT_PROFILE_IMAGE);
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl);
          setPreviewObjectUrl(null);
        }
      }

      // 서버 에러 파싱
      const parsed = parseServerError(error);

      if (!parsed) {
        alert("프로필 수정 중 오류가 발생했습니다.");
        return;
      }

      const { message } = parsed;
      alert(message || "프로필 수정 중 알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 일반유저 프로필 수정: PC에서는 2단, 모바일/태블릿에서는 1단 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-between">
        {/* 왼쪽 열: 이름, 이메일, 전화번호, 비밀번호 */}
        <div className="flex flex-col gap-6">
          <FormField
            label="이름"
            type="text"
            register={register("name")}
            error={errors.name}
            placeholder="이름"
            touched={!!touchedFields.name}
          />
          <FormField
            label="이메일"
            type="text"
            register={register("email")}
            error={errors.email}
            placeholder="이메일"
            touched={!!touchedFields.email}
            disabled
          />
          <FormField
            label="전화번호"
            type="text"
            register={register("phoneNum")}
            error={errors.phoneNum}
            placeholder="전화번호"
            touched={!!touchedFields.phoneNum}
          />
          <FormField
            label="현재 비밀번호"
            register={register("currentPassword")}
            error={errors.currentPassword}
            touched={!!touchedFields.currentPassword}
          >
            <PasswordInput
              register={register("currentPassword")}
              placeholder="현재 비밀번호"
              error={errors.currentPassword}
              touched={!!touchedFields.currentPassword}
            />
          </FormField>
          <FormField
            label="새 비밀번호"
            register={register("newPassword")}
            error={errors.newPassword}
            touched={!!touchedFields.newPassword}
          >
            <PasswordInput
              register={register("newPassword")}
              placeholder="새 비밀번호"
              error={errors.newPassword}
              touched={!!touchedFields.newPassword}
            />
          </FormField>
          <FormField
            label="새 비밀번호 확인"
            register={register("newPasswordConfirm")}
            error={errors.newPasswordConfirm}
            touched={!!touchedFields.newPasswordConfirm}
          >
            <PasswordInput
              register={register("newPasswordConfirm")}
              placeholder="새 비밀번호 확인"
              error={errors.newPasswordConfirm}
              touched={!!touchedFields.newPasswordConfirm}
            />
          </FormField>
        </div>

        {/* 오른쪽 열: 프로필 이미지, 이용 서비스, 내가 사는 지역 */}
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
            label="이용 서비스"
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
            label="내가 사는 지역"
            register={register("region")}
            error={errors.region}
            placeholder="지역"
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
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
