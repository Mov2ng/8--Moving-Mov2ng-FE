"use client";

import { useAuth } from "@/hooks/useAuth";
import DriverProfileForm from "@/components/profile/DriverProfileForm";
import UserProfileRegisterForm from "@/components/profile/UserProfileRegisterForm";
import { usePostProfile } from "@/hooks/useProfile";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";
import { useI18n } from "@/libs/i18n/I18nProvider";

/**
 * 프로필 등록 페이지 컨테이너
 * - 사용자 역할에 따라 DriverProfileForm 또는 UserProfileRegisterForm 렌더링
 * - 로딩 처리는 RouteGuard에서 담당
 */
export default function ProfileRegisterContainer() {
  const { me, isLoading: isPending } = useAuth();
  const { t } = useI18n();
  const postProfileMutation = usePostProfile();

  const handleDriverSubmit = async (data: ProfileFormValues) => {
    await postProfileMutation.mutateAsync(data);
  };

  // me가 로드되지 않았으면 렌더링하지 않음 (깜빡임 방지)
  if (isPending || me === undefined) {
    return null;
  }

  const isDriver = me?.role === "DRIVER";

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 my-10 px-6">
      <div className="text-[32px] font-semibold">
        {isDriver ? t("driver_profile_register_title") : t("profile_register_title")}
      </div>
      <div className="text-xl text-black-200">
        {t("profile_register_desc")}
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
