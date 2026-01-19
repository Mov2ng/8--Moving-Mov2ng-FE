import DriverProfile from "@/components/common/DriverProfile";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { quoteStatusChip } from "@/constants/quoteStatus";
import {
  DEFAULT_SERVICE_ICON,
  isServiceTypeKey,
  SERVICE_ICON_MAP,
  SERVICE_LABEL_SHORT_MAP,
} from "@/constants/serviceType";
import { QuoteDetailCardProps } from "@/types/view/quote";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function QuoteDetailCard({
  status,
  serviceType,
  isDesignatedRequest = false,
  designatedLabel = "지정 견적 요청",
  description,
  name,
  profileImage,
  avatarSize = "sm",
  avatarResponsive = false,
  rating,
  reviewCount,
  experience,
  confirmedCount,
  likeCount,
  price,
}: QuoteDetailCardProps) {
  const statusInfo = status ? quoteStatusChip[status] : null;
  const { t } = useI18n();
  const statusLabelMap: Record<NonNullable<typeof status>, string> = {
    waiting: t("quote_status_waiting"),
    confirmed: t("quote_status_confirmed"),
    rejected: t("quote_status_rejected"),
  };
  const statusLabel =
    status && statusLabelMap[status]
      ? statusLabelMap[status]
      : statusInfo?.label;
  const iconSrc =
    serviceType && isServiceTypeKey(serviceType)
      ? SERVICE_ICON_MAP[serviceType]
      : DEFAULT_SERVICE_ICON;
  const shortLabel =
    serviceType && isServiceTypeKey(serviceType)
      ? SERVICE_LABEL_SHORT_MAP[serviceType]
      : serviceType ?? "";

  return (
    <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100">
      {/* 태그 영역 */}
      <div className="flex gap-2 mb-4">
        {statusInfo && (
          <span
            className={`px-2 py-1 pret-xs-semibold rounded ${statusInfo.className}`}
          >
            {statusLabel ?? statusInfo.label}
          </span>
        )}
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

      {/* 소개 문구 */}
      <p className="text-black-400 pret-lg-semibold mb-4">{description}</p>

      {/* 프로필 영역 */}
      <div className="mb-3 pb-3">
        <DriverProfile
          name={name}
          profileImage={profileImage}
          avatarSize={avatarSize}
          avatarResponsive={avatarResponsive}
          rating={rating}
          reviewCount={reviewCount}
          experience={experience}
          confirmedCount={confirmedCount}
          likeCount={likeCount}
        />
      </div>

      {price !== undefined && (
        <div className="flex justify-end items-center gap-2">
          <span className="text-black-100 pret-14-medium">
            {t("quote_price")}
          </span>
          <span className="text-black-400 pret-xl-bold">
            {price.toLocaleString()}원
          </span>
        </div>
      )}
    </div>
  );
}
