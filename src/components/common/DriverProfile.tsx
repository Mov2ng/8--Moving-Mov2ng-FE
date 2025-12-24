import Image from "next/image";
import ProfileAvatar from "@/components/common/ProfileAvatar";

interface DriverProfileProps {
  name?: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  nameSuffix?: string;
  ratingDisplay?: "numeric" | "stars";
  ratingPlacement?: "meta" | "below";
  rating?: number;
  reviewCount?: number;
  experience?: number;
  confirmedCount?: number;
  likeCount?: number;
  services?: string[];
  regions?: string[];
  movingDate?: string;
  quotePrice?: number;
}

export default function DriverProfile({
  name,
  profileImage,
  avatarSize = "md",
  avatarResponsive = true,
  nameSuffix = "기사님",
  ratingDisplay = "numeric",
  ratingPlacement = "meta",
  rating,
  reviewCount,
  experience,
  confirmedCount,
  likeCount,
  services,
  regions,
  movingDate,
  quotePrice,
}: DriverProfileProps) {
  const metaItems: React.ReactNode[] = [];

  const hasRating = rating !== undefined || reviewCount !== undefined;
  const score = rating ?? 0;
  const stars = Array.from({ length: 5 }, (_, idx) => idx < Math.round(score));

  const ratingNode = hasRating ? (
    <span className="flex items-center gap-1" key="rating">
      {ratingDisplay === "stars" ? (
        <>
          {stars.map((filled, idx) => (
            <Image
              key={idx}
              src={
                filled
                  ? "/assets/icon/ic-star-active.svg"
                  : "/assets/icon/ic-star-default.svg"
              }
              alt="별점"
              width={16}
              height={16}
            />
          ))}
          {reviewCount !== undefined && (
            <span className="text-gray-300">({reviewCount})</span>
          )}
        </>
      ) : (
        <>
          <Image
            src="/assets/icon/ic-star-active.svg"
            alt="별점"
            width={16}
            height={16}
          />
          <span className="text-black-300 pret-14-semibold">
            {rating !== undefined ? rating.toFixed(1) : "-"}
          </span>
          <span className="text-gray-300">
            ({reviewCount !== undefined ? reviewCount : "-"})
          </span>
        </>
      )}
    </span>
  ) : null;

  if (experience !== undefined) {
    metaItems.push(
      <span key="experience">
        <span className="text-gray-300">경력</span>{" "}
        <span className="text-black-300 pret-14-medium">{experience}년</span>
      </span>
    );
  }

  if (confirmedCount !== undefined) {
    metaItems.push(
      <span key="confirmed">
        <span className="text-black-300 pret-14-medium">
          {confirmedCount}건
        </span>{" "}
        <span className="text-gray-300">확정</span>
      </span>
    );
  }

  const metaWithRating =
    ratingPlacement === "meta" && ratingNode
      ? [ratingNode, ...metaItems]
      : metaItems;

  return (
    <div className="flex flex-col gap-2 p-3 border border-line-100 rounded-md">
      <div className="flex items-start gap-3">
        {/* 프로필 아바타 */}
        <ProfileAvatar
          src={profileImage}
          alt={`${name ?? "프로필"} 프로필`}
          size={avatarSize}
          responsive={avatarResponsive}
        />

        {/* 기사님 정보 + 좋아요 */}
        <div className="flex flex-col flex-1 min-w-0 gap-4 lg:gap-2">
          <div className="flex items-center justify-between gap-2">
            {name && (
              <span className="text-black-300 lg:text-black-300 pret-13-medium lg:pret-xl-medium">
                {name}
                {nameSuffix ? ` ${nameSuffix}` : ""}
              </span>
            )}
            {likeCount !== undefined && (
              <div className="flex items-center gap-1 shrink-0">
                <Image
                  src="/assets/icon/ic-like-active.svg"
                  alt="좋아요"
                  width={24}
                  height={24}
                />
                <span className="text-primary-blue-400 pret-xs-semibold">
                  {likeCount}
                </span>
              </div>
            )}
          </div>

          {metaWithRating.length > 0 && (
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1 text-black-100 pret-xs-medium lg:pret-14-medium">
              {metaWithRating.map((item, idx) => (
                <span className="flex items-center gap-2" key={idx}>
                  {idx > 0 && <span className="text-line-200">|</span>}
                  {item}
                </span>
              ))}
            </div>
          )}

          {(movingDate || quotePrice !== undefined) && (
            <div className="flex flex-wrap items-center gap-3 max-md:gap-1">
              {movingDate && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 pret-14-medium">이사일</span>
                  <span className="text-black-400 max-md:text-black-300 text-[20px] leading-[26px] max-md:text-[13px] max-md:leading-[22px]">
                    {movingDate}
                  </span>
                </div>
              )}
              {movingDate && quotePrice !== undefined && (
                <span className="text-line-200">|</span>
              )}
              {quotePrice !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 pret-14-medium">견적가</span>
                  <span className="text-black-400 max-md:text-black-300 text-[20px] leading-[26px] max-md:text-[13px] max-md:leading-[22px]">
                    {quotePrice.toLocaleString()}원
                  </span>
                </div>
              )}
            </div>
          )}

          {ratingPlacement === "below" && ratingNode && (
            <div className="flex items-center gap-1">{ratingNode}</div>
          )}

          {(services?.length || regions?.length) && (
            <div className="flex flex-wrap items-center gap-3 pret-14-medium text-black-100">
              {services?.length ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-background-400 text-gray-300 rounded">
                    제공 서비스
                  </span>
                  <span className="text-black-400">{services.join(", ")}</span>
                </div>
              ) : null}

              {regions?.length ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-background-400 text-gray-300 rounded">
                    지역
                  </span>
                  <span className="text-black-400">{regions.join(", ")}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
