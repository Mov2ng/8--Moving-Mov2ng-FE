import DriverProfile from "@/components/common/DriverProfile";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import Button from "@/components/common/button";
import { useI18n } from "@/libs/i18n/I18nProvider";

interface ReviewCreateCardProps {
  // 태그
  serviceType?: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  // 기사 정보
  name: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  // 일정/금액
  movingDate: string;
  price: number;
  // 버튼
  onWriteReview?: () => void;
  reviewEnabled?: boolean;
  reviewButtonText?: string;
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

export default function ReviewCreateCard({
  serviceType,
  isDesignatedRequest = false,
  designatedLabel = "지정 견적 요청",
  name,
  profileImage,
  avatarSize = "md",
  avatarResponsive = false,
  movingDate,
  price,
  onWriteReview,
  reviewEnabled = true,
  reviewButtonText = "리뷰 작성하기",
}: ReviewCreateCardProps) {
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
    <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100">
      {/* 태그 영역 */}
      <div className="flex gap-2 mb-4">
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

      {/* 프로필/이사 정보 */}
      <div className="mb-4">
        <DriverProfile
          name={name}
          profileImage={profileImage}
          avatarSize={avatarSize}
          avatarResponsive={avatarResponsive}
          movingDate={movingDate}
          quotePrice={price}
        />
      </div>

      {/* 리뷰 버튼 */}
      <Button
        text={reviewButtonText ?? t("review_write")}
        variant="solid"
        width="100%"
        onClick={onWriteReview}
        disabled={!reviewEnabled}
      />
    </div>
  );
}
