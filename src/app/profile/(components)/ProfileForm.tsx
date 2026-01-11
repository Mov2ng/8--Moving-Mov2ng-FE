"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FormField from "@/components/form/FormField";
import TextInput from "@/components/form/TextInput";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { usePostProfile } from "@/hooks/useProfile";
import {
  ProfileFormValues,
  profileSchema,
} from "@/libs/validation/profileSchemas";
import { parseServerError } from "@/utils/parseServerError";
import { REGIONS, SERVICE_CATEGORIES } from "@/constants/profile.constants";
// import { DEFAULT_AVATARS } from "@/constants/profile.constants"; // TODO: 추후 랜덤 아바타 선택 기능 추가 시 사용
import ProfileChips from "@/components/common/ProfileChips";
import { useRouter } from "next/navigation";
import { fileService } from "@/services/fileService";

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

const DEFAULT_PROFILE_IMAGE = "/assets/image/upload-default.png";

// TODO: 추후 랜덤 아바타 선택 함수 및 버튼 추가

export default function ProfileForm() {
  const router = useRouter();
  // 현재 사용자 role 조회
  const { me } = useAuth();

  // 프로필 등록 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields, isValid },
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProfileFormValues>({
    // 폼 검증 스키마 설정 및 전달
    resolver: zodResolver(profileSchema(me?.role)),
    mode: "onTouched", // 커스텀 필드와 수동 값 설정이 많아 touchedFields 추적이 어려워 onTouched로 설정
  });

  // 서비스 카테고리 목록
  const serviceCategories = SERVICE_CATEGORIES;
  // 지역 목록
  const regions = REGIONS;

  // 프로필 등록 mutation 준비
  const postProfileMutation = usePostProfile();

  // 프로필 이미지 미리보기용 state
  const [previewImage, setPreviewImage] = useState<string>(
    DEFAULT_PROFILE_IMAGE
  ); // 화면에 표시할 이미지 URL (presigned URL 또는 object URL)
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 선택된 파일 (제출 시 업로드)
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null); // S3에 업로드된 파일 키 (기존 이미지)
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null); // URL.createObjectURL로 생성한 object URL (cleanup용으로만 사용)

  // 파일 input ref (Image 클릭 시 파일 선택 창 열기용)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 창이 열렸는지 추적 (취소 감지용)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  // register의 ref와 fileInputRef를 병합
  const profileImageRegister = register("profileImage");
  const mergedRef = (node: HTMLInputElement | null) => {
    profileImageRegister.ref(node);
    fileInputRef.current = node;
  };

  // 컴포넌트 언마운트 시 또는 값 변경 시 previewObjectUrl 정리
  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl); // 메모리 누수 방지를 위한 object URL 해제
      }
    };
  }, [previewObjectUrl]);

  // 기존 프로필 이미지가 있을 때 조회용 presigned URL로 미리보기 표시 (프로필 수정 모드 등에서 사용)
  // 사용 예시: useEffect(() => { if (initialProfileImage) loadExistingProfileImage(initialProfileImage); }, []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadExistingProfileImage = async (fileKey: string) => {
    if (!fileKey) return;

    try {
      // 조회용 presigned URL 요청
      const { presignedUrl } = await fileService.getViewPresignedUrl(fileKey);
      setPreviewImage(presignedUrl);
      setUploadedFileKey(fileKey);
    } catch (error) {
      console.error("프로필 이미지 조회 실패:", error);
      setPreviewImage(DEFAULT_PROFILE_IMAGE);
    }
  };

  // 프로필 이미지 에러 체크 함수
  const checkProfileImageError = () => {
    if (
      previewImage === DEFAULT_PROFILE_IMAGE &&
      !selectedFile &&
      !uploadedFileKey
    ) {
      setError("profileImage", {
        type: "required",
        message: "프로필 이미지를 업로드해주세요.",
      });
    }
  };

  // 프로필 이미지 선택 핸들러 (미리보기만 표시, 업로드는 제출 시)
  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // 파일 선택 창이 닫혔음을 표시
    setIsFileDialogOpen(false);

    // 이전 object URL 정리 (메모리 누수 방지)
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl); // 브라우저 메모리에서 실제로 해제
      setPreviewObjectUrl(null); // object URL 정리 (다음 cleanup 시 중복 해제 방지)
    }

    // 파일이 선택되지 않은 경우 정리
    if (!file) {
      setValue("profileImage", ""); // profileImage를 빈 문자열로 설정 (파일 선택 취소 시)
      setPreviewImage(DEFAULT_PROFILE_IMAGE); // 기본 이미지로 복원
      setSelectedFile(null); // 선택된 파일 정리
      setUploadedFileKey(null); // 업로드된 파일 키 정리 (S3에 업로드된 파일 키)
      // 파일 선택 취소 시 에러 체크
      checkProfileImageError();
      return; // 파일 선택 취소 시 종료
    }

    // 파일 선택 시 미리보기 표시 (로컬 object URL 사용)
    const objectUrl = URL.createObjectURL(file); // 파일을 URL로 변환
    setPreviewImage(objectUrl); // 미리보기 이미지 URL 설정
    setPreviewObjectUrl(objectUrl); // object URL 저장 (cleanup용으로만 사용)
    setSelectedFile(file); // 제출 시 업로드할 파일 저장
    setUploadedFileKey(null); // 새 파일 선택 시 기존 업로드된 키 초기화
    setValue("profileImage", objectUrl); // react-hook-form에 값 등록 (검증을 위한 임시 blob URL)
    // 파일 선택 시 에러 제거
    clearErrors("profileImage");
  };

  // Image 클릭 핸들러 (파일 선택 창 열기)
  const handleImageClick = () => {
    setIsFileDialogOpen(true);
    fileInputRef.current?.click();
  };

  // window focus 이벤트로 파일 선택 창 취소 감지
  useEffect(() => {
    const handleWindowFocus = () => {
      // 파일 선택 창이 열려있었는데 window가 다시 focus를 받으면 취소된 것으로 간주
      if (isFileDialogOpen) {
        setIsFileDialogOpen(false);
        // 약간의 지연 후 체크 (onChange가 발생할 수 있으므로)
        setTimeout(() => {
          if (
            !selectedFile &&
            !uploadedFileKey &&
            previewImage === DEFAULT_PROFILE_IMAGE
          ) {
            setError("profileImage", {
              type: "required",
              message: "프로필 이미지를 업로드해주세요.",
            });
          }
        }, 100);
      }
    };

    // window focus 이벤트 리스너 등록
    window.addEventListener("focus", handleWindowFocus);

    // window focus 이벤트 리스너 제거
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [isFileDialogOpen, selectedFile, uploadedFileKey, previewImage, setError]);

  // 프로필 등록 제출 핸들러
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // 프로필 이미지 처리
      // 1. 새 파일이 선택된 경우: presignedUrl 요청 → S3 업로드 → fileKey 저장
      if (selectedFile) {
        try {
          // 1-1. 백엔드에서 presigned URL 요청
          const contentType = selectedFile.type || "image/jpeg";
          const { presignedUrl, fileKey } = await fileService.getPresignedUrl({
            fileName: selectedFile.name,
            category: "PROFILE",
            contentType,
          });

          // 1-2. presigned URL로 S3에 파일 업로드 (PUT 요청)
          await fileService.uploadToS3(presignedUrl, selectedFile, contentType);

          // 1-3. 업로드 완료 후 fileKey 저장
          data.profileImage = fileKey;
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
          return; // 제출 중단
        }
      }
      // 2. 기존 업로드된 파일이 있는 경우: 해당 fileKey 사용
      else if (uploadedFileKey) {
        data.profileImage = uploadedFileKey;
      }
      // 3. 파일이 없는 경우: 에러 처리
      else if (!data.profileImage) {
        setError("profileImage", {
          type: "required",
          message: "프로필 이미지를 업로드해주세요.",
        });
        return; // 제출 중단
      }
      // TODO: 추후 랜덤 아바타 선택할 수 있는 로직과 버튼 추가 예정

      // 프로필 등록 요청
      await postProfileMutation.mutateAsync(data);

      // 성공 시 form reset + 성공 UI 처리
      reset();
      setSelectedFile(null); // 선택된 파일 정리
      setUploadedFileKey(null); // 업로드된 파일 키 정리 (S3에 업로드된 파일 키)
      // previewObjectUrl 정리 (메모리 누수 방지)
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        setPreviewObjectUrl(null);
      }
    } catch (error) {
      // s3 업로드는 완료 but 프로필 등록 실패 경우 롤백
      if (selectedFile && data.profileImage) {
        try {
          await fileService.deleteFile(data.profileImage);
          console.log("프로필 등록 실패로 인한 이미지 롤백 완료");
        } catch (rollbackError) {
          console.error("이미지 롤백 실패:", rollbackError);
          // 롤백 실패는 조용히 처리 (이미 프로필 등록이 실패한 상태)
        }
        // 롤백 후 상태 초기화
        setUploadedFileKey(null);
        setSelectedFile(null);
        setPreviewImage(DEFAULT_PROFILE_IMAGE);
        // previewObjectUrl 정리 (메모리 누수 방지)
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl);
          setPreviewObjectUrl(null);
        }
      }

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

  const isDriver = me?.role === "DRIVER";

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 mt-10">
      <div className="text-[32px] font-semibold">
        {isDriver ? "기사님 " : ""}프로필 등록
      </div>
      <div className="text-xl text-black-200">
        추가 정보를 입력하여 회원가입을 완료해주세요.
      </div>
      <hr className="border-line-100" />
      {/* 브라우저 기본 검증 비활성화 */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {isDriver ? (
          // 기사님 프로필 등록: PC에서는 2단, 모바일/태블릿에서는 1단
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-between">
            {/* 왼쪽 열: 프로필 이미지, 별명, 경력, 한줄 소개 */}
            <div className="flex flex-col gap-6">
              <FormField
                label="프로필 이미지"
                type="file"
                register={register("profileImage")}
                error={toFieldError(errors.profileImage)}
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
                    className="cursor-pointer"
                  />
                  <input
                    ref={mergedRef}
                    type="file"
                    accept="image/*"
                    name={profileImageRegister.name}
                    onChange={(e) => {
                      profileImageRegister.onChange(e);
                      handleProfileImageSelect(e);
                    }}
                    className="hidden"
                  />
                </div>
              </FormField>
              <FormField
                label="별명"
                type="text"
                register={register("nickname")}
                error={toFieldError(errors.nickname)}
                placeholder="별명"
                touched={!!touchedFields.nickname}
              />
              <FormField
                label="경력"
                register={register("driverYears", { valueAsNumber: true })}
                error={toFieldError(errors.driverYears)}
                touched={!!touchedFields.driverYears || !!errors.driverYears}
              >
                <div className="flex items-center gap-2">
                  <TextInput
                    register={register("driverYears", { valueAsNumber: true })}
                    placeholder="경력"
                    error={toFieldError(errors.driverYears)}
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
                error={toFieldError(errors.driverIntro)}
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
                error={toFieldError(errors.driverContent)}
                placeholder="상세 설명"
                touched={!!touchedFields.driverContent}
              />
              <FormField
                label="제공 서비스"
                register={register("serviceCategories")}
                error={toFieldError(errors.serviceCategories)}
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
                error={toFieldError(errors.region)}
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
                  {isSubmitting ? "프로필 등록 중..." : "시작하기"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 일반회원 프로필 등록: 항상 1단
          <>
            <FormField
              label="프로필 이미지"
              type="file"
              register={register("profileImage")}
              error={toFieldError(errors.profileImage)}
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
                  className="cursor-pointer"
                />
                <input
                  ref={mergedRef}
                  type="file"
                  accept="image/*"
                  name={profileImageRegister.name}
                  onChange={(e) => {
                    profileImageRegister.onChange(e);
                    handleProfileImageSelect(e);
                  }}
                  className="hidden"
                />
              </div>
            </FormField>
            <FormField
              label="이용 서비스"
              register={register("serviceCategories")}
              error={toFieldError(errors.serviceCategories)}
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
              error={toFieldError(errors.region)}
              placeholder="지역"
              touched={!!touchedFields.region}
            >
              <ProfileChips chipList={regions} register={register("region")} />
            </FormField>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "프로필 등록 중..." : "시작하기"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
