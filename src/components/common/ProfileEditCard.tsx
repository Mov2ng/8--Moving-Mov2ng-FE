// 프로필 카드

import DriverProfile from "@/components/common/DriverProfile";
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
  const baseBtn =
    "inline-flex items-center justify-center gap-2 h-[64px] px-4 py-4 rounded-2xl text-[20px] leading-[24px]";
  const secondaryBtn = `${baseBtn} border border-gray-200 bg-transparent text-black-300 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`;
  const primaryBtn = `${baseBtn} border border-primary-blue-300 bg-primary-blue-300 text-white hover:bg-primary-blue-300 hover:border-primary-blue-300 hover:shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed`;

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
          <button
            type="button"
            className={`${secondaryBtn} w-full lg:w-[280px]`}
            onClick={onBasicInfoEdit}
            disabled={secondaryDisabled}
          >
            <span>{basicInfoEditLabel}</span>
            <Image
              src="/assets/icon/ic-writing-gray.svg"
              alt=""
              width={20}
              height={20}
            />
          </button>
          <button
            type="button"
            className={`${primaryBtn} w-full lg:w-[280px]`}
            onClick={onProfileEdit}
          >
            <span>{profileEditLabel}</span>
            <Image
              src="/assets/icon/ic-writing.svg"
              alt=""
              width={20}
              height={20}
            />
          </button>
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
