"use client";

import { useAuth } from "@/hooks/useAuth";
import DriverProfileForm from "@/components/profile/DriverProfileForm";
import UserProfileRegisterForm from "@/components/profile/UserProfileRegisterForm";
import { usePostProfile } from "@/hooks/useProfile";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";

/**
 * 프로필 등록 페이지 컨테이너
 * - 사용자 역할에 따라 DriverProfileForm 또는 UserProfileRegisterForm 렌더링
 * - 로딩 처리는 RouteGuard에서 담당
 */
export default function ProfileRegisterContainer() {
  const { me, isLoading } = useAuth();
  const postProfileMutation = usePostProfile();

  const handleDriverSubmit = async (data: ProfileFormValues) => {
    await postProfileMutation.mutateAsync(data);
  };

  // me가 로드되지 않았으면 렌더링하지 않음 (깜빡임 방지)
  if (isLoading || me === undefined) {
    return null;
  }

  const isDriver = me?.role === "DRIVER";

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 mt-10 px-6">
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
