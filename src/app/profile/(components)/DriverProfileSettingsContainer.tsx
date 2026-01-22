"use client";

import { useAuth } from "@/hooks/useAuth";
import DriverBasicInfoForm from "@/components/profile/DriverBasicInfoForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useI18n } from "@/libs/i18n/I18nProvider";

/**
 * DriverProfileSettingsContainer: 기사님 기본 정보 수정 페이지 컨테이너
 * - 사용자 기본 정보를 불러와 DriverBasicInfoForm에 전달
 * @returns
 */
export default function DriverProfileSettingsContainer() {
  const { me, isLoading: isPending } = useAuth();
  const { t } = useI18n();
  console.log("me: ", me);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t("profile_cannot_load_data")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 my-10 px-6">
      <div className="text-[32px] font-semibold">{t("basic_info_edit_title")}</div>
      <div className="text-xl text-black-200">{t("basic_info_edit_desc")}</div>
      <hr className="border-line-100" />
      <DriverBasicInfoForm
        initialData={{
          name: me.name,
          email: me.email,
          phoneNum: me.phone_number,
        }}
      />
    </div>
  );
}
