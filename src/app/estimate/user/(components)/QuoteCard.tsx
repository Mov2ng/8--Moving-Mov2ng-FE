import DriverProfile from "@/components/common/DriverProfile";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import Button from "@/components/common/button";
import { quoteStatusChip } from "@/constants/quoteStatus";
import {
  DEFAULT_SERVICE_ICON,
  isServiceTypeKey,
  SERVICE_ICON_MAP,
  SERVICE_LABEL_SHORT_MAP,
} from "@/constants/serviceType";
import { useI18n } from "@/libs/i18n/I18nProvider";

interface QuoteCardProps {
  // 기사님 정보
  name: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  ratingPlacement?: "meta" | "below";
  rating: number;
  reviewCount: number;
  experience: number;
  confirmedCount: number;
  likeCount: number;
  // 견적 상태
  status: "waiting" | "confirmed" | "rejected";
  // 이사 유형
  serviceType?: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  // 이사 정보
  movingDate?: string;
  departure?: string;
  arrival?: string;
  // 견적 금액
  price: number;
  // 이벤트 핸들러
  onConfirm?: () => void;
  onDetail?: () => void;
}

export default function QuoteCard({
  name,
  profileImage,
  rating,
  ratingPlacement = "meta",
  reviewCount,
  experience,
  confirmedCount,
  likeCount,
  avatarSize = "md",
  avatarResponsive = true,
  status,
  serviceType,
  isDesignatedRequest = false,
  designatedLabel = "지정 견적 요청",
  movingDate,
  departure,
  arrival,
  price,
  onConfirm,
  onDetail,
}: QuoteCardProps) {
  const statusInfo = quoteStatusChip[status];
  const { t } = useI18n();
  const statusLabelMap: Record<QuoteCardProps["status"], string> = {
    waiting: t("quote_status_waiting"),
    confirmed: t("quote_status_confirmed"),
    rejected: t("quote_status_rejected"),
  };
  const statusLabel = statusLabelMap[status] ?? statusInfo.label;
  const iconSrc =
    serviceType && isServiceTypeKey(serviceType)
      ? SERVICE_ICON_MAP[serviceType]
      : DEFAULT_SERVICE_ICON;
  const shortLabel =
    serviceType && isServiceTypeKey(serviceType)
      ? SERVICE_LABEL_SHORT_MAP[serviceType]
      : serviceType ?? "";

  return (
    <div className="bg-gray-50 rounded-2xl p-[14px] shadow-sm border border-line-100">
      {/* 태그 영역 */}
      <div className="flex gap-2 mb-4">
        <span
          className={`px-2 py-1 pret-xs-semibold rounded ${statusInfo.className}`}
        >
          {statusLabel}
        </span>
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

      {/* 프로필 영역 */}
      <div className="mb-4 pb-4">
        <DriverProfile
          name={name}
          profileImage={profileImage}
          avatarSize={avatarSize}
          avatarResponsive={avatarResponsive}
          ratingPlacement={ratingPlacement}
          rating={rating}
          reviewCount={reviewCount}
          experience={experience}
          confirmedCount={confirmedCount}
          likeCount={likeCount}
        />
      </div>

      {(movingDate || departure || arrival) && (
        <div className="flex flex-wrap gap-2 mb-4 pret-14-medium text-black-100">
          {movingDate && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="px-2 py-1 bg-background-400 text-gray-500 rounded">
                {t("moving_date_label")}
              </span>
              <span className="text-black-400">{movingDate}</span>
            </div>
          )}
          {departure && (
            <>
              <span className="hidden lg:inline text-line-200 self-center">
                |
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-background-400 text-gray-500 rounded">
                  {t("departure_short")}
                </span>
                <span className="text-black-400">{departure}</span>
              </div>
            </>
          )}
          {arrival && (
            <>
              <span className="text-line-200 self-center">|</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-background-400 text-gray-500 rounded">
                  {t("arrival_short")}
                </span>
                <span className="text-black-400">{arrival}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 견적 금액 */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <span className="text-black-100 pret-14-medium">
          {t("quote_price")}
        </span>
        <span className="text-black-400 pret-xl-bold">
          {price.toLocaleString()}원
        </span>
      </div>

      {/* 버튼 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onConfirm && (
          <Button
            text={t("quote_confirm")}
            variant="solid"
            width="100%"
            onClick={onConfirm}
          />
        )}
        {onDetail && (
          <Button
            text={t("quote_detail")}
            variant="outline"
            width="100%"
            onClick={onDetail}
          />
        )}
      </div>
    </div>
  );
}
