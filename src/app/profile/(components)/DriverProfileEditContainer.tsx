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

/**
 * DriverProfileEditContainer: 기사님 프로필 수정 페이지 컨테이너
 * - 기사님 프로필 데이터를 불러와 DriverProfileForm에 전달
 * @returns
 */
export default function DriverProfileEditContainer() {
  const { me, isLoading: isAuthLoading } = useAuth();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile();

  const profile = profileData?.data;
  const isLoading = isAuthLoading || isProfileLoading;

  // me.profileImage(fileKey)로 presigned URL 조회
  const { data: profileImageUrl } = useGetViewPresignedUrl(
    profile?.profileImage
  );

  const putProfileMutation = usePutProfile();

  const handleSubmit = async (data: ProfileFormValues) => {
    await putProfileMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue-300 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 mt-10">
      <div className="text-[32px] font-semibold">기사님 프로필 수정</div>
      <div className="text-xl text-black-200">프로필 정보를 수정해주세요.</div>
      <hr className="border-line-100" />
      <DriverProfileForm
        mode="edit"
        initialData={{
          profileImage: profileImageUrl ?? "/assets/image/avatartion-3.png",
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
