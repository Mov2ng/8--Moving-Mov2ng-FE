// 프로필 카드

import DriverProfile from "@/components/common/DriverProfile";
import EditButton from "@/components/common/EditButton";
import Image from "next/image";

interface ProfileEditCardProps {
  name: string;
  description?: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  confirmedCount?: number;
  services?: string[];
  regions?: string[];
  profileEditLabel?: string;
  basicInfoEditLabel?: string;
  onProfileEdit?: () => void;
  onBasicInfoEdit?: () => void;
  secondaryDisabled?: boolean;
}

export default function ProfileEditCard({
  name,
  description,
  profileImage,
  avatarSize = "md",
  avatarResponsive = false,
  rating,
  reviewCount,
  experience,
  confirmedCount,
  services,
  regions,
  profileEditLabel = "내 프로필 수정",
  basicInfoEditLabel = "기본 정보 수정",
  onProfileEdit,
  onBasicInfoEdit,
  secondaryDisabled = false,
}: ProfileEditCardProps) {
  return (
    <div className="bg-background-200 rounded-2xl p-4 shadow-sm">
      {/* 상단 정보 + 버튼 + 프로필 */}
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="flex flex-col gap-1 order-1 lg:col-start-1 lg:row-start-1">
          <span className="text-black-300 pret-lg-semibold lg:text-black-300 lg:pret-2xl-semibold">
            {name}
          </span>
          {description && (
            <span className="text-gray-400 pret-14-regular lg:pret-xl-regular lg:text-gray-400 lg:leading-[32px] truncate">
              {description}
            </span>
          )}
        </div>

        <div className="flex gap-2 flex-col sm:flex-row w-full order-3 lg:order-2 lg:col-start-2 lg:row-start-1">
          <EditButton
            variant="outline"
            label={basicInfoEditLabel}
            iconSrc="/assets/icon/ic-writing-gray.svg"
            className="w-full lg:w-[280px] border-gray-200 text-black-300 hover:bg-gray-100 hover:border-gray-300"
            onClick={onBasicInfoEdit}
            disabled={secondaryDisabled}
          />
          <EditButton
            variant="solid"
            label={profileEditLabel}
            iconSrc="/assets/icon/ic-writing.svg"
            className="w-full lg:w-[280px]"
            onClick={onProfileEdit}
          />
        </div>

        {/* 프로필 상세 */}
        <div className="mt-2 order-2 lg:order-3 lg:col-span-2 lg:row-start-2">
          <DriverProfile
            profileImage={profileImage}
            avatarSize={avatarSize}
            avatarResponsive={avatarResponsive}
            rating={rating}
            reviewCount={reviewCount}
            experience={experience}
            confirmedCount={confirmedCount}
            services={services}
            regions={regions}
          />
        </div>
      </div>
    </div>
  );
}
