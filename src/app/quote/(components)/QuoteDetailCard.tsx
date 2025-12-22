import DriverProfile from "@/components/common/DriverProfile";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { QuoteDetailCardProps } from "@/types/view/quote";

const statusMap = {
  waiting: {
    label: "견적 대기",
    className: "bg-background-300 text-black-300",
  },
  confirmed: {
    label: "확정 견적",
    className: "bg-primary-blue-100 text-primary-blue-300",
  },
  rejected: {
    label: "견적 거절",
    className: "bg-secondary-red-100 text-secondary-red-200",
  },
};

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
  const statusInfo = status ? statusMap[status] : null;
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
        {statusInfo && (
          <span
            className={`px-2 py-1 pret-xs-semibold rounded ${statusInfo.className}`}
          >
            {statusInfo.label}
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
                label="지정 견적"
                iconSrc="/icons/redfile.svg"
                size="sm"
                variant="rd"
              />
            </div>
            <div className="hidden lg:inline-flex">
              <MovingTypeChip
                label={designatedLabel}
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
          <span className="text-black-100 pret-14-medium">견적 금액</span>
          <span className="text-black-400 pret-xl-bold">
            {price.toLocaleString()}원
          </span>
        </div>
      )}
    </div>
  );
}
