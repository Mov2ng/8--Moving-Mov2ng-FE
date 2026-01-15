"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetProfile, usePutUserProfile } from "@/hooks/useProfile";
import UserProfileEditForm from "@/components/profile/UserProfileEditForm";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";
import { BasicInfoFormValues } from "@/libs/validation/basicInfoSchemas";

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
  const { me, isLoading: isAuthLoading } = useAuth();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile(
    !!me && !isAuthLoading
  );

  const profile = profileData?.data;
  const isLoading = isAuthLoading || isProfileLoading;

  // me.profileImage(fileKey)로 presigned URL 조회
  const { data: profileImageUrl } = useGetViewPresignedUrl(
    profile?.profileImage
  );

  const putProfileMutation = usePutUserProfile();

  const handleSubmit = async (data: UserProfileSubmitData) => {
    await putProfileMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue-300 border-t-transparent" />
      </div>
    );
  }

  if (!me || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 mt-10">
      <div className="text-[32px] font-semibold">프로필 수정</div>
      <div className="text-xl text-black-200">프로필 정보를 수정해주세요.</div>
      <hr className="border-line-100" />
      <UserProfileEditForm
        initialData={{
          name: me.name,
          email: me.email,
          phoneNum: me.phone_number, // TODO: BE에서 phoneNum으로 반환 매핑
          profileImage: profileImageUrl ?? "/assets/image/avatar-3.png",
          profileImageKey: profile.profileImage, // fileKey (비교용)
          serviceCategories: profile.serviceCategories,
          region: profile.region,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
