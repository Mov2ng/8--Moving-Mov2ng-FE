import Image from "next/image";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import {
  getServiceLabels,
  getRegionLabels,
} from "@/constants/profile.constants";

interface MypageProfileProps {
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  confirmedCount?: number;
  services?: string[];
  regions?: string[];
}

/**
 * MypageProfile: 마이페이지 프로필 컴포넌트
 */
export default function MypageProfile({
  profileImage,
  avatarSize = "md",
  avatarResponsive = false,
  rating,
  reviewCount,
  experience,
  confirmedCount,
  services,
  regions,
}: MypageProfileProps) {
  // 프로필 메타 정보
  const metaItems: React.ReactNode[] = [];

  const hasRating = rating !== undefined || reviewCount !== undefined;

  const ratingNode = hasRating ? (
    <span className="flex items-center gap-1" key="rating">
      <Image
        src="/assets/icon/ic-star-active.svg"
        alt="별점"
        width={20}
        height={20}
        className="lg:w-6 lg:h-6"
      />
      <span className="text-base text-black-300">
        {rating !== undefined ? rating.toFixed(1) : "-"}
      </span>
      <span className="text-base text-gray-300">
        ({reviewCount !== undefined ? reviewCount : "-"})
      </span>
    </span>
  ) : null;

  if (experience !== undefined) {
    metaItems.push(
      <span key="experience" className="flex items-center gap-1 lg:gap-1.5">
        <span className="text-base text-gray-300">경력</span>
        <span className="text-base text-black-300">{experience}년</span>
      </span>
    );
  }

  if (confirmedCount !== undefined) {
    metaItems.push(
      <span key="confirmed" className="flex items-center gap-1 lg:gap-1.5">
        <span className="text-base text-black-300">{confirmedCount}건</span>
        <span className="text-base text-gray-300">확정</span>
      </span>
    );
  }

  const metaWithRating = ratingNode ? [ratingNode, ...metaItems] : metaItems;

  return (
    <div className="flex flex-col gap-2 p-3 lg:p-6 max-md:p-[10px] border border-line-100 lg:border-line-200 rounded-md lg:rounded-[6px] bg-background-100 shadow-[4px_4px_16px_0px_rgba(233,233,233,0.1)]">
      <div className="flex items-start gap-3 lg:gap-6">
        {/* 프로필 아바타 - PC에서만 표시 */}
        <ProfileAvatar
          src={profileImage}
          alt="프로필"
          size={avatarSize}
          responsive={avatarResponsive}
          className="hidden lg:block lg:w-[80px] lg:h-[80px]"
        />

        {/* 프로필 정보 */}
        <div className="flex flex-col my-auto flex-1 gap-4 lg:gap-4">
          {metaWithRating.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-black-100 pret-xs-medium lg:pret-lg-medium">
              {metaWithRating.map((item, idx) => (
                <span className="flex items-center gap-2" key={idx}>
                  {idx > 0 && (
                    <span className="text-line-200 lg:text-line-200 w-0 h-[14px]">
                      |
                    </span>
                  )}
                  {item}
                </span>
              ))}
            </div>
          )}

          {(services?.length || regions?.length) && (
            <div className="flex flex-wrap items-center gap-3 lg:gap-4 max-md:flex-col max-md:items-start max-md:gap-2 pret-14-medium lg:pret-2lg-medium text-black-100">
              {services?.length ? (
                <div className="flex items-center gap-2 lg:gap-3">
                  <span className="text-lg px-[6px] py-[2px] lg:px-[6px] lg:py-1 bg-background-200 lg:bg-background-200 text-gray-400 lg:text-gray-500 rounded">
                    제공 서비스
                  </span>
                  <span className="text-lg text-black-300 lg:text-black-300">
                    {getServiceLabels(services).join(", ")}
                  </span>
                </div>
              ) : null}

              {regions?.length && (
                <>
                  {services?.length && (
                    <span className="hidden lg:block text-line-200 w-0 h-4">
                      |
                    </span>
                  )}
                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className="text-lg px-[6px] py-[2px] lg:px-[6px] lg:py-1 bg-background-200 lg:bg-background-200 text-gray-400 lg:text-gray-500 rounded">
                      지역
                    </span>
                    <span className="text-lg text-black-300 lg:text-black-300">
                      {getRegionLabels(regions).join(", ")}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
