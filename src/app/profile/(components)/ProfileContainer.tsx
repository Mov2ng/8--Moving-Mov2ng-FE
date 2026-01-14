"use client";

import ProfileEditCard from "@/components/common/ProfileEditCard";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyMoverDetail } from "@/hooks/useProfile";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import ReviewSection from "../../../components/common/ReviewSection";
import { useRouter } from "next/navigation";

/**
 * 마이페이지 컨테이너
 * @returns
 */
export default function ProfileContainer() {
  const { me, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // /movers/me API를 사용하여 user_id로 driver 정보 조회
  const { data: moverData, isLoading: isMoverLoading } = useGetMyMoverDetail(
    !!me && !isAuthLoading
  );

  // me.profileImage(fileKey)로 presigned URL 조회
  const { data: profileImageUrl } = useGetViewPresignedUrl(me?.profileImage);

  const driver = moverData?.data;
  const isLoading = isAuthLoading || isMoverLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue-300 border-t-transparent" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl max-md:text-lg font-bold text-black-400">
        마이페이지
      </h1>
      <ProfileEditCard
        name={driver.nickname}
        description={driver.driverContent}
        profileImage={profileImageUrl || "/assets/image/avatartion-3.png"}
        avatarSize="md"
        avatarResponsive={true}
        rating={driver.rating}
        reviewCount={driver.reviewCount}
        experience={driver.driverYears}
        confirmedCount={driver.confirmCount}
        regions={driver.regions}
        services={driver.serviceCategories}
        onProfileEdit={() => router.push("/profile/driver/edit")}
        onBasicInfoEdit={() => router.push("/profile/driver/settings")}
      />
      <ReviewSection
        rating={driver.rating}
        reviewCount={driver.reviewCount}
        reviewList={driver.reviewList}
        reviews={driver.reviews}
        page={1}
      />
    </div>
  );
}
