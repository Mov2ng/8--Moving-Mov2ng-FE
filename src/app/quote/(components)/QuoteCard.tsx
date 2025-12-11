import DriverProfile from "@/components/common/DriverProfile";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import Button from "@/components/atom/button";

interface QuoteCardProps {
  // 기사님 정보
  name: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
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
  movingDate: string;
  departure: string;
  arrival: string;
  // 견적 금액
  price: number;
  // 이벤트 핸들러
  onConfirm?: () => void;
  onDetail?: () => void;
}

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

export default function QuoteCard({
  name,
  profileImage,
  rating,
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
  const statusInfo = statusMap[status];
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
  const iconSrc =
    serviceType && serviceIconMap[serviceType]
      ? serviceIconMap[serviceType]
      : "/icons/box.svg";
  const shortLabel = serviceType
    ? serviceLabelShortMap[serviceType] ?? serviceType
    : "";

  return (
    <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100">
      {/* 태그 영역 */}
      <div className="flex gap-2 mb-4">
        <span
          className={`px-2 py-1 pret-xs-semibold rounded ${statusInfo.className}`}
        >
          {statusInfo.label}
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

      {/* 프로필 영역 */}
      <div className="mb-4 pb-4 border-b border-line-100">
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

      <div className="flex flex-wrap gap-2 mb-4 pret-14-medium text-black-100">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="px-2 py-1 bg-background-400 text-gray-500 rounded">
            이사일
          </span>
          <span className="text-black-400">{movingDate}</span>
        </div>
        <span className="hidden lg:inline text-gray-300 self-center">|</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-background-400 text-gray-500 rounded">
            출발
          </span>
          <span className="text-black-400">{departure}</span>
        </div>
        <span className="text-gray-300 self-center">|</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-background-400 text-gray-500 rounded">
            도착
          </span>
          <span className="text-black-400">{arrival}</span>
        </div>
      </div>

      {/* 견적 금액 */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <span className="text-black-100 pret-14-medium">견적 금액</span>
        <span className="text-black-400 pret-xl-bold">
          {price.toLocaleString()}원
        </span>
      </div>

      {/* 버튼 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          text="견적 확정하기"
          variant="solid"
          width="100%"
          onClick={onConfirm}
        />
        <Button
          text="상세보기"
          variant="outline"
          width="100%"
          onClick={onDetail}
        />
      </div>
    </div>
  );
}
