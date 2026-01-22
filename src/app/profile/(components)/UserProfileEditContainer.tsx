"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetProfile, usePutUserProfile } from "@/hooks/useProfile";
import UserProfileEditForm from "@/components/profile/UserProfileEditForm";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";
import { BasicInfoFormValues } from "@/libs/validation/basicInfoSchemas";
import { DEFAULT_AVATAR_IMAGE } from "@/constants/profile.constants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useI18n } from "@/libs/i18n/I18nProvider";

/**
 * UserProfileSubmitData: 일반유저 프로필 수정 제출 데이터 타입
 * - 프로필 필드와 기본정보 필드 모두 변경된 필드만 전송
 */
type UserProfileSubmitData = Partial<ProfileFormValues> &
  Partial<BasicInfoFormValues>;

/**
 * UserProfileEditContainer: 일반유저 프로필 수정 페이지 컨테이너
 * - 사용자 정보와 프로필 데이터 불러와 UserProfileEditForm에 전달
 */
export default function UserProfileEditContainer() {
  const { me, isLoading: isAuthPending } = useAuth();
  const { t } = useI18n();
  const {
    data: profileData,
    isLoading: isProfilePending,
  } = useGetProfile(!!me && !isAuthPending);

  const profile = profileData?.data;
  const isPending = isAuthPending || isProfilePending;

  // me.profileImage(fileKey)로 presigned URL 조회
  const { data: profileImageUrl } = useGetViewPresignedUrl(
    profile?.profileImage
  );

  const putProfileMutation = usePutUserProfile();

  const handleSubmit = async (data: UserProfileSubmitData) => {
    await putProfileMutation.mutateAsync(data);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!me || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t("profile_cannot_load_data")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 my-10 px-6">
      <div className="text-[32px] font-semibold">{t("profile_edit_title")}</div>
      <div className="text-xl text-black-200">{t("profile_edit_desc")}</div>
      <hr className="border-line-100" />
      <UserProfileEditForm
        initialData={{
          name: me.name,
          email: me.email,
          phoneNum: me.phone_number, // TODO: BE에서 phoneNum으로 반환 매핑
          profileImage: profileImageUrl ?? DEFAULT_AVATAR_IMAGE,
          profileImageKey: profile.profileImage, // fileKey (비교용)
          serviceCategories: profile.serviceCategories,
          region: profile.region,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
