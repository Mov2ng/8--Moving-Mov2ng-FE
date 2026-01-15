// 내가 작성한 리뷰 카드
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import DriverProfile from "@/components/common/DriverProfile";
import { useI18n } from "@/libs/i18n/I18nProvider";

interface WrittenReviewCardProps {
  // 태그
  serviceType?: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  createdAt?: string;
  // 기사 정보
  name: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  // 일정/금액
  movingDate: string;
  price: number;
  // 리뷰
  rating?: number; // 0~5
  reviewCount?: number;
  experience?: number;
  confirmedCount?: number;
  reviewText: string;
}

const serviceIconMap: Record<string, string> = {
  소형이사: "/icons/box.svg",
  가정이사: "/icons/home.svg",
  사무실이사: "/icons/office.svg",
};

const serviceLabelShortMap: Record<string, string> = {
  소형이사: "소형",
  가정이사: "가정",
  사무실이사: "사무실",
};

export default function WrittenReviewCard({
  serviceType,
  isDesignatedRequest = false,
  designatedLabel = "지정 견적 요청",
  createdAt,
  name,
  profileImage,
  avatarSize = "md",
  avatarResponsive = false,
  movingDate,
  price,
  rating = 0,
  reviewText,
}: WrittenReviewCardProps) {
  const { t } = useI18n();
  const iconSrc =
    serviceType && serviceIconMap[serviceType]
      ? serviceIconMap[serviceType]
      : "/icons/box.svg";
  const shortLabel =
    serviceType && serviceLabelShortMap[serviceType]
      ? serviceLabelShortMap[serviceType]
      : serviceType ?? "";

  return (
    <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100 flex flex-col gap-4">
      {/* 상단 태그 + 작성일 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {serviceType && (
            <>
              <div className="lg:hidden">
                <MovingTypeChip
                  label={shortLabel}
                  iconSrc={iconSrc}
                  size="sm"
                  variant="bl"
                />
              </div>
              <div className="hidden lg:inline-flex">
                <MovingTypeChip
                  label={serviceType}
                  iconSrc={iconSrc}
                  size="sm"
                  variant="bl"
                />
              </div>
            </>
          )}
          {isDesignatedRequest && (
            <>
              <div className="lg:hidden">
                <MovingTypeChip
                  label={t("designated_quote_short")}
                  iconSrc="/icons/redfile.svg"
                  size="sm"
                  variant="rd"
                />
              </div>
              <div className="hidden lg:inline-flex">
                <MovingTypeChip
                  label={designatedLabel ?? t("designated_quote_full")}
                  iconSrc="/icons/redfile.svg"
                  size="sm"
                  variant="rd"
                />
              </div>
            </>
          )}
        </div>
        {createdAt && (
          <span className="text-gray-300 pret-14-medium">{`${t(
            "review_date_prefix"
          )}${createdAt}`}</span>
        )}
      </div>

      {/* 기사 정보 + 견적 (DriverProfile 재사용) */}
      <DriverProfile
        name={name}
        profileImage={profileImage}
        rating={rating}
        ratingDisplay="stars"
        ratingPlacement="below"
        avatarSize={avatarSize}
        avatarResponsive={avatarResponsive}
        movingDate={movingDate}
        quotePrice={price}
      />

      {/* 리뷰 내용 */}
      <div className="text-black-300 pret-14-regular lg:pret-xl-regular leading-[24px] lg:leading-[32px]">
        {reviewText}
      </div>
    </div>
  );
}
