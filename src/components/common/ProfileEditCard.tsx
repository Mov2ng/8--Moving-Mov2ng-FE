// 프로필 카드

import MypageProfile from "@/components/common/MypageProfile";
import EditButton from "@/components/common/EditButton";
import ProfileAvatar from "@/components/common/ProfileAvatar";

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

/**
 * ProfileEditCard: 프로필 수정 카드 컴포넌트
 */
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
    <div className="bg-background-100 border border-gray-100 rounded-2xl p-6 lg:p-6 max-md:p-4 shadow-sm">
      {/* PC 레이아웃: 상단 정보 + 버튼 */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-6 lg:mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-black-300 pret-2xl-semibold">{name}</span>
          {description && (
            <span className="text-gray-400 pret-xl-regular leading-[32px]">
              {description}
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <EditButton
            variant="outline"
            label={basicInfoEditLabel}
            iconSrc="/assets/icon/ic-writing-gray.svg"
            className="w-[280px] border-gray-200 text-gray-300 hover:bg-gray-100 hover:border-gray-300"
            onClick={onBasicInfoEdit}
            disabled={secondaryDisabled}
          />
          <EditButton
            variant="solid"
            label={profileEditLabel}
            iconSrc="/assets/icon/ic-writing.svg"
            className="w-[280px]"
            onClick={onProfileEdit}
          />
        </div>
      </div>

      {/* 태블릿/모바일: 프로필 상세 정보 (프로필 이미지 포함) */}
      <div className="lg:hidden mb-4">
        <div className="flex gap-4 mb-4">
          <ProfileAvatar
            src={profileImage}
            alt={`${name} 프로필`}
            size="sm"
            responsive={false}
            className="w-[46px] h-[46px] shrink-0"
          />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-black-300 pret-lg-semibold">{name}</span>
            {description && (
              <span className="text-gray-400 pret-14-regular truncate">
                {description}
              </span>
            )}
          </div>
        </div>
        <MypageProfile
          profileImage={profileImage}
          avatarSize="sm"
          avatarResponsive={false}
          rating={rating}
          reviewCount={reviewCount}
          experience={experience}
          confirmedCount={confirmedCount}
          services={services}
          regions={regions}
        />
      </div>

      {/* PC: 프로필 상세 */}
      <div className="hidden lg:block">
        <MypageProfile
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

      {/* 태블릿/모바일: 버튼 */}
      <div className="lg:hidden flex flex-col sm:flex-row gap-2 sm:gap-4">
        <EditButton
          variant="solid"
          label={profileEditLabel}
          iconSrc="/assets/icon/ic-writing.svg"
          className="w-full sm:w-[296px]"
          onClick={onProfileEdit}
        />
        <EditButton
          variant="outline"
          label={basicInfoEditLabel}
          iconSrc="/assets/icon/ic-writing-gray.svg"
          className="w-full sm:w-[296px] border-gray-200 text-gray-300 hover:bg-gray-100 hover:border-gray-300"
          onClick={onBasicInfoEdit}
          disabled={secondaryDisabled}
        />
      </div>
    </div>
  );
}
