"use client";

import { useAuth } from "@/hooks/useAuth";
import DriverProfileForm from "@/components/profile/DriverProfileForm";
import UserProfileRegisterForm from "@/components/profile/UserProfileRegisterForm";
import { usePostProfile } from "@/hooks/useProfile";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";

/**
 * 프로필 등록 페이지 컨테이너
 * - 사용자 역할에 따라 DriverProfileForm 또는 UserProfileRegisterForm 렌더링
 */
export default function ProfileRegisterContainer() {
  const { me, isLoading } = useAuth();
  const postProfileMutation = usePostProfile();

  const handleDriverSubmit = async (data: ProfileFormValues) => {
    await postProfileMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue-300 border-t-transparent" />
      </div>
    );
  }

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
      {isDriver ? (
        <DriverProfileForm mode="create" onSubmit={handleDriverSubmit} />
      ) : (
        <UserProfileRegisterForm />
      )}
    </div>
  );
}
