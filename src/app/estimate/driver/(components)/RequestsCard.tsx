import React from "react";
import Link from "next/link";
import type { DriverRequest } from "@/types/api/driverRequest";
import { formatDateLabel } from "@/utils/date";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

const movingTypeMap: Record<string, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  HOUSE: "가정이사",
  OFFICE: "사무실이사",
};

export type RequestItem = DriverRequest;

export const RequestCard: React.FC<{
  item: RequestItem;
  onReject?: (requestId: number) => void;
}> = ({ item, onReject }) => {
  const movingTypeLabel =
    movingTypeMap[item.movingType] ?? item.movingType;
  const timeAgo = item.requestCreatedAt
    ? formatRelativeTime(item.requestCreatedAt)
    : "-";
  const date = item.movingDate
    ? formatDateLabel(item.movingDate)
    : "-";

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded">
            {movingTypeLabel}
          </span>
          {item.isDesignated && (
            <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[12px] font-medium rounded">
              지정 견적 요청
            </span>
          )}
        </div>
        <span className="text-[13px] text-gray-400">{timeAgo}</span>
      </div>

      <h4 className="text-[16px] font-semibold text-gray-900 mb-4">
        {item.userId ?? "고객"} 고객님
      </h4>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="text-gray-500 w-12">이사일</span>
          <span className="text-gray-900">{date}</span>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <span className="text-gray-500 w-12">출발</span>
          <span className="text-gray-900">{item.origin ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <span className="text-gray-500 w-12">도착</span>
          <span className="text-gray-900">{item.destination ?? "-"}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/estimate/driver/pending/${item.requestId}`}
          className="flex-1 h-11 bg-blue-500 text-white rounded-lg font-semibold text-[14px] hover:bg-blue-600 flex items-center justify-center gap-1"
        >
          견적 보내기 ✎
        </Link>
        <button
          onClick={() => onReject?.(item.requestId)}
          className="flex-1 h-11 border border-blue-500 text-blue-500 rounded-lg font-semibold text-[14px] hover:bg-blue-50"
        >
          반려
        </button>
      </div>
    </div>
  );
};