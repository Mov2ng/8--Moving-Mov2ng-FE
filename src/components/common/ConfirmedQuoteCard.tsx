import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

interface ConfirmedQuoteCardProps {
  // 상태/태그
  statusLabel?: string;
  serviceType?: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  isRejected?: boolean;
  rejectedMessage?: string;
  isCompleted?: boolean;
  completedMessage?: string;
  viewDetailLabel?: string;
  onViewDetail?: () => void;
  requestedAt?: string;
  // 고객 정보
  name: string;
  // 이사 정보
  movingDate: string;
  departure: string;
  arrival: string;
  // 견적 금액
  price: number;
  className?: string;
}

const statusStyle =
  "px-2 py-1 pret-xs-semibold rounded bg-background-300 text-black-300";

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

export default function ConfirmedQuoteCard({
  statusLabel = "견적 확정",
  serviceType,
  isDesignatedRequest = false,
  designatedLabel = "지정 견적 요청",
  isRejected = false,
  rejectedMessage = "반려된 요청이에요",
  isCompleted = false,
  completedMessage = "이사 완료된 견적이에요",
  viewDetailLabel = "견적 상세보기",
  onViewDetail,
  requestedAt,
  name,
  movingDate,
  departure,
  arrival,
  price,
  className = "",
}: ConfirmedQuoteCardProps) {
  const iconSrc =
    serviceType && serviceIconMap[serviceType]
      ? serviceIconMap[serviceType]
      : "/icons/box.svg";
  const shortLabel =
    serviceType && serviceLabelShortMap[serviceType]
      ? serviceLabelShortMap[serviceType]
      : serviceType ?? "";
  const relativeRequestedAt = requestedAt
    ? formatRelativeTime(requestedAt)
    : null;

  return (
    <div className="relative">
      <div
        className={`
          bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100
          ${className}
        `}
      >
        {/* 태그 + 시간 */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {!isRejected && <span className={statusStyle}>{statusLabel}</span>}
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
          {relativeRequestedAt && (
            <span className="text-gray-300 pret-14-medium shrink-0">
              {relativeRequestedAt}
            </span>
          )}
        </div>

        {/* 이름 */}
        <div className="text-black-300 pret-xl-semibold mb-3">{name}</div>

        <div className="border-t border-line-100 mb-3" />

        {/* 이사 정보 */}
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-2 mb-4 pret-14-medium text-black-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-background-400 text-gray-400 rounded">
              이사일
            </span>
            <span className="text-black-400">{movingDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-background-400 text-gray-400 rounded">
              출발
            </span>
            <span className="text-black-400">{departure}</span>
            <span className="text-line-200 self-center">|</span>
            <span className="px-3 py-1 bg-background-400 text-gray-400 rounded">
              도착
            </span>
            <span className="text-black-400">{arrival}</span>
          </div>
        </div>

        {/* 견적 금액 */}
        <div className="flex justify-end items-center gap-2">
          <span className="text-black-100 pret-14-medium">견적 금액</span>
          <span className="text-black-400 pret-xl-bold">
            {price.toLocaleString()}원
          </span>
        </div>
      </div>

      {isRejected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
          <div className="text-white pret-lg-semibold text-center">
            {rejectedMessage}
          </div>
        </div>
      )}
      {!isRejected && isCompleted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-4">
          <div className="text-white pret-lg-semibold text-center">
            {completedMessage}
          </div>
          <button
            type="button"
            onClick={onViewDetail}
            className="px-5 py-3 rounded-[16px] border border-primary-blue-200 bg-primary-blue-100 text-primary-blue-300 pret-14-semibold"
          >
            {viewDetailLabel}
          </button>
        </div>
      )}
    </div>
  );
}
