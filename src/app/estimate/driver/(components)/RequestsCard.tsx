import React from "react";
import Image from "next/image";
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
  onReject?: (item: RequestItem) => void;
  onSendEstimate?: (item: RequestItem) => void;
}> = ({ item, onReject, onSendEstimate }) => {
  if (!item) {
    console.warn("RequestCard - item is null or undefined");
    return null;
  }
  
  console.log("RequestCard - item:", item);
  console.log("RequestCard - item.requestId:", item.requestId);
  
  const movingTypeLabel =
    movingTypeMap[item.movingType] ?? item.movingType;
  const timeAgo = item.requestCreatedAt
    ? formatRelativeTime(item.requestCreatedAt)
    : "-";
  // 날짜 형식: 2024. 07. 01(월) - 공백 추가
  const date = item.movingDate
    ? formatDateLabel(item.movingDate).replace(/(\d{4})\.(\d{2})\.(\d{2})/, "$1. $2. $3")
    : "-";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {/* 상단: 태그와 시간 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded flex items-center gap-1.5">
            <Image
              src="/assets/icon/ic-box.svg"
              alt=""
              width={14}
              height={14}
              className="w-3.5 h-3.5"
            />
            {movingTypeLabel}
          </span>
          {item.isDesignated && (
            <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[12px] font-medium rounded flex items-center gap-1.5">
              <Image
                src="/assets/icon/ic-File-dock-fill.svg"
                alt=""
                width={14}
                height={14}
                className="w-3.5 h-3.5"
              />
              지정 견적 요청
            </span>
          )}
        </div>
        <span className="text-[13px] text-gray-400">{timeAgo}</span>
      </div>

      {/* 고객명 */}
      <h4 className="text-[16px] font-semibold text-gray-900 mb-4">
        {item.userName ?? "고객"} 고객님
      </h4>

      {/* 구분선 */}
      <div className="h-px bg-gray-200 mb-4"></div>

      {/* 이사 정보 */}
      <div className="flex items-center gap-4 mb-6 text-[14px] flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">이사일</span>
          <span className="text-gray-900">{date}</span>
        </div>
        <span className="text-gray-300 h-4 w-px bg-gray-300"></span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">출발</span>
          <span className="text-gray-900">{item.origin ?? "-"}</span>
        </div>
        <span className="text-gray-300 h-4 w-px bg-gray-300"></span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">도착</span>
          <span className="text-gray-900">{item.destination ?? "-"}</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={() => onSendEstimate?.(item)}
          className="flex-1 h-11 bg-blue-500 text-white rounded-lg font-semibold text-[14px] hover:bg-blue-600 flex items-center justify-center gap-1.5"
        >
          견적 보내기
          <Image
            src="/assets/icon/ic-writing.svg"
            alt=""
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </button>
        <button
          onClick={() => onReject?.(item)}
          className="flex-1 h-11 border border-blue-500 text-blue-500 bg-white rounded-lg font-semibold text-[14px] hover:bg-blue-50 transition-colors"
        >
          반려
        </button>
      </div>
    </div>
  );
};