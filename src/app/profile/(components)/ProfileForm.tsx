"use client";

import FormField from "@/components/form/FormField";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { usePostProfile } from "@/hooks/useProfile";
import {
  ProfileFormValues,
  profileSchema,
} from "@/libs/validation/profileSchemas";
import { parseServerError } from "@/utils/parseServerError";
import {
  DEFAULT_AVATARS,
  REGIONS,
  SERVICE_CATEGORIES,
} from "@/constants/profile.constants";
import ProfileChips from "@/components/common/ProfileChips";
import { useRouter } from "next/navigation";

// RHF FieldError 형태인지 판별 (배열 필드 등에서 좁히기 용도)
function isFieldError(error: unknown): error is FieldError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "type" in error
  );
}

// 넓은 에러 타입을 FormField가 요구하는 FieldError로 안전하게 변환
function toFieldError(error: unknown): FieldError | undefined {
  if (isFieldError(error)) return error;
  return undefined;
}

// 랜덤 아바타 선택 함수
function getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length);
  return DEFAULT_AVATARS[randomIndex];
}

export default function ProfileForm() {
  const router = useRouter();
  // 현재 사용자 role 조회
  const { me } = useAuth();

  // 프로필 등록 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ProfileFormValues>({
    // 폼 검증 스키마 설정 및 전달
    resolver: zodResolver(profileSchema(me?.role)),
  });

  // 서비스 카테고리 목록
  const serviceCategories = SERVICE_CATEGORIES;
  // 지역 목록
  const regions = REGIONS;

  // 프로필 등록 mutation 준비
  const postProfileMutation = usePostProfile();

  /**
   * S3 연동 시 사용할 이미지 업로드 관련 코드 (추후 구현 예정)
   *
   * 필요한 import:
   * - import { useState, useEffect } from "react";
   * - import { fileService } from "@/services/fileService";
   *
   * useForm에서 추가 필요:
   * - setValue, watch
   */
  /*
  // 프로필 이미지 미리보기를 위한 state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 파일 입력값 감시
  const profileImageFile = watch("profileImage") as FileList | undefined;

  // 파일 선택 시 미리보기 생성
  useEffect(() => {
    const file = profileImageFile?.[0];
    if (file) {
      // File 객체를 URL로 변환하여 미리보기 표시
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // cleanup: 컴포넌트 언마운트 시 또는 파일 변경 시 이전 URL 해제
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage(null);
    }
  }, [profileImageFile]);

  // 프로필 이미지 업로드 핸들러
  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // profileImage는 필수값이 아니므로 파일이 없어도 괜찮음
    const file = e.target.files?.[0];
    if (!file) {
      // 파일이 선택되지 않았거나 취소된 경우, profileImage를 undefined로 설정
      setValue("profileImage", undefined);
      setPreviewImage(null);
      return;
    }

    try {
      // 1. 백엔드에서 presigned URL 요청
      const presignedUrl = await fileService.getPresignedUrl(file.name, file.type);
      // 2. presigned URL로 S3에 파일 업로드
      await fileService.uploadToS3(presignedUrl, file);
      // 3. 업로드 완료 후 S3 URL을 form state에 저장
      const uploadedUrl = await fileService.getS3Url(file.name);
      // 4. S3 URL을 form state에 저장
      setValue("profileImage", uploadedUrl);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      setError("profileImage", {
        message: "파일 업로드에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };
  */

  // 프로필 등록 제출 핸들러
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // 기본 아바타 이미지 중 랜덤으로 선택
      data.profileImage = getRandomAvatar();

      // 프로필 등록 요청
      await postProfileMutation.mutateAsync(data);

      // 성공 시 form reset + 성공 UI 처리
      reset();
    } catch (error) {
      // 서버 에러 파싱
      const parsed = parseServerError(error);

      // 에러 파싱 실패 시
      if (!parsed) {
        alert("프로필 등록 중 오류가 발생했습니다.");
        return;
      }

      const { code, status, message } = parsed;

      // 프로필 이미 존재 에러 (409 또는 PROFILE_ALREADY_EXISTS 코드)
      if (status === 409 || code === "PROFILE_ALREADY_EXISTS") {
        alert(message || "프로필이 이미 등록되어 있습니다.");
        router.push("/");
        return;
      }

      // 일반 에러 메시지 표시
      alert(message || "프로필 등록 중 알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="text-32px ">
        {me?.role === "DRIVER" ? "기사님 " : ""}프로필 등록
      </div>
      <div>추가 정보를 입력하여 회원가입을 완료해주세요.</div>
      {/* 브라우저 기본 검증 비활성화 */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* <FormField
          label="프로필 이미지"
          type="file"
          register={register("profileImage")}
          error={toFieldError(errors.profileImage)}
          placeholder="프로필 이미지"
        >
          <Image
            src={previewImage ?? "/assets/image/upload-default.png"}
            alt="profile image preview"
            width={100}
            height={100}
          />
          <input
            type="file"
            accept="image/*"
            {...register("profileImage")}
            onChange={handleProfileImageUpload}
          />
        </FormField> */}
        {me?.role === "DRIVER" && (
          <>
            <FormField
              label="별명"
              type="text"
              register={register("nickname")}
              error={toFieldError(errors.nickname)}
              placeholder="별명"
            />
            <FormField
              label="경력"
              register={register("driverYears", { valueAsNumber: true })}
              error={toFieldError(errors.driverYears)}
            >
              <input
                type="number"
                {...register("driverYears", { valueAsNumber: true })}
                placeholder="경력"
              />
              년
            </FormField>
            <FormField
              label="한 줄 소개"
              type="textarea"
              register={register("driverIntro")}
              error={toFieldError(errors.driverIntro)}
              placeholder="한 줄 소개"
            />
            <FormField
              label="상세 설명"
              type="textarea"
              register={register("driverContent")}
              error={toFieldError(errors.driverContent)}
              placeholder="상세 설명"
            />
          </>
        )}
        <FormField
          label={me?.role === "DRIVER" ? "제공 서비스" : "이용 서비스"}
          register={register("serviceCategories")}
          error={toFieldError(errors.serviceCategories)}
          placeholder="서비스"
        >
          <ProfileChips
            chipList={serviceCategories}
            register={register("serviceCategories")}
          />
        </FormField>
        <FormField
          label={me?.role === "DRIVER" ? "서비스 가능 지역" : "내가 사는 지역"}
          register={register("region")}
          error={toFieldError(errors.region)}
          placeholder="지역"
        >
          <ProfileChips chipList={regions} register={register("region")} />
        </FormField>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "프로필 등록 중..." : "시작하기"}
        </button>
      </form>
    </>
  );
}
