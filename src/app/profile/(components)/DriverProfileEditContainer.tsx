"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  useGetMyMoverDetail,
  useGetProfile,
  usePutProfile,
} from "@/hooks/useProfile";
import DriverProfileForm from "@/components/profile/DriverProfileForm";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import { DEFAULT_AVATAR_IMAGE } from "@/constants/profile.constants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useI18n } from "@/libs/i18n/I18nProvider";

/**
 * DriverProfileEditContainer: 기사님 프로필 수정 페이지 컨테이너
 * - 기사님 프로필 데이터를 불러와 DriverProfileForm에 전달
 * @returns
 */
export default function DriverProfileEditContainer() {
  const { me, isLoading: isAuthPending } = useAuth();
  const { t } = useI18n();
  const { data: profileData, isLoading: isProfilePending } = useGetProfile();

  const profile = profileData?.data;
  const isPending = isAuthPending || isProfilePending;

  // me.profileImage(fileKey)로 presigned URL 조회
  const { data: profileImageUrl } = useGetViewPresignedUrl(
    profile?.profileImage
  );

  const putProfileMutation = usePutProfile();

  const handleSubmit = async (data: ProfileFormValues) => {
    await putProfileMutation.mutateAsync(data);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t("profile_cannot_load_data")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 my-10 px-6">
      <div className="text-[32px] font-semibold">{t("driver_profile_edit_title")}</div>
      <div className="text-xl text-black-200">{t("profile_edit_desc")}</div>
      <hr className="border-line-100" />
      <DriverProfileForm
        mode="edit"
        initialData={{
          profileImage: profileImageUrl ?? DEFAULT_AVATAR_IMAGE,
          profileImageKey: profile.profileImage, // fileKey (비교용)
          nickname: profile.nickname,
          driverYears: profile.driverYears,
          driverIntro: profile.driverIntro,
          driverContent: profile.driverContent,
          serviceCategories: profile.serviceCategories,
          region: profile.region,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
