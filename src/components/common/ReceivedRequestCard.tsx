import MovingTypeChip from "@/components/chips/MovingTypeChip";
import EditButton from "@/components/common/EditButton";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

interface ReceivedRequestCardProps {
  // 태그
  serviceType?: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  // 요청 시각
  requestedAt?: string;
  // 고객 정보
  name: string;
  // 이사 정보
  movingDate: string;
  departure: string;
  arrival: string;
  // 이벤트
  onSendQuote?: () => void;
  onReject?: () => void;
  className?: string;
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

export default function ReceivedRequestCard({
  serviceType,
  isDesignatedRequest = false,
  designatedLabel = "지정 견적 요청",
  requestedAt,
  name,
  movingDate,
  departure,
  arrival,
  onSendQuote,
  onReject,
  className = "",
}: ReceivedRequestCardProps) {
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
    <div
      className={`
        bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100
        ${className}
      `}
    >
      {/* 상단 태그 & 시간 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
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
      <div className="flex flex-wrap items-center gap-2 mb-4 pret-14-medium text-black-100">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-background-400 text-gray-400 rounded">
            이사일
          </span>
          <span className="text-black-400">{movingDate}</span>
        </div>
        <span className="hidden lg:inline text-line-200 self-center">|</span>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-background-400 text-gray-400 rounded">
            출발
          </span>
          <span className="text-black-400">{departure}</span>
        </div>
        <span className="text-line-200 self-center">|</span>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-background-400 text-gray-400 rounded">
            도착
          </span>
          <span className="text-black-400">{arrival}</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <EditButton
          variant="solid"
          label="견적 보내기"
          iconSrc="/assets/icon/ic-writing.svg"
          className="w-full"
          onClick={onSendQuote}
        />
        <EditButton
          variant="outline"
          label="반려"
          iconSrc={undefined}
          className="w-full"
          onClick={onReject}
        />
      </div>
    </div>
  );
}
