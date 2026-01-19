"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import Button from "@/components/common/button";
import { formatDateLabel } from "@/utils/date";
import type { DriverRequestDetail } from "@/types/api/driverRequest";

interface RejectEstimateModalProps {
  open: boolean;
  onClose: () => void;
  data: DriverRequestDetail | null;
  onSubmit: (payload: { requestReason: string }) => void;
  isSubmitting?: boolean;
  isDesignated?: boolean;
}

const movingTypeMap: Record<string, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  HOUSE: "가정이사",
  OFFICE: "사무실이사",
};

const movingTypeIconMap: Record<string, string> = {
  SMALL: "/assets/icon/ic-box.svg",
  HOME: "/assets/icon/ic-home-fill.svg",
  HOUSE: "/assets/icon/ic-home-fill.svg",
  OFFICE: "/assets/icon/ic-office-fill.svg",
};

export default function RejectEstimateModal({
  open,
  onClose,
  data,
  onSubmit,
  isSubmitting = false,
  isDesignated = false,
}: RejectEstimateModalProps) {
  const [reason, setReason] = useState("");

  const movingTypeLabel = useMemo(() => {
    if (!data?.movingType) return "";
    return movingTypeMap[data.movingType] ?? data.movingType;
  }, [data]);

  const movingTypeIcon = useMemo(() => {
    if (!data?.movingType) return "/assets/icon/ic-box.svg";
    return movingTypeIconMap[data.movingType] ?? "/assets/icon/ic-box.svg";
  }, [data]);

  const formattedDate = useMemo(() => {
    if (!data?.movingDate) return "";
    return formatDateLabel(data.movingDate);
  }, [data]);

  if (!open || !data) return null;

  const isReasonValid = reason.trim().length >= 10;
  const disabled = isSubmitting || !isReasonValid;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit({
      requestReason: reason.trim(),
    });
    // 제출 후 초기화
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
      <div className="inline-flex flex-col items-start gap-6 w-full max-w-[560px] bg-white rounded-[20px] shadow-lg border border-line-100 px-6 pt-8 pb-10 relative">
        {/* 헤더 */}
        <div className="flex items-start justify-between w-full">
          <div className="text-primary-black-400 pret-2xl-semibold">
            요청 반려
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={handleClose}
            className="text-gray-300 hover:text-black-300 cursor-pointer"
          >
            <Image
              src="/assets/icon/ic-cancel.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 태그 영역 */}
        <div className="flex flex-wrap gap-2 w-full">
          {movingTypeLabel && (
            <MovingTypeChip
              label={movingTypeLabel}
              iconSrc={movingTypeIcon}
              size="sm"
              variant="bl"
            />
          )}
          {isDesignated && (
            <MovingTypeChip
              label="지정 견적 요청"
              iconSrc="/assets/icon/ic-File-dock-fill.svg"
              size="sm"
              variant="rd"
            />
          )}
        </div>

        {/* 고객 정보 박스 */}
        <div className="w-full border border-line-100 rounded-xl p-4 bg-gray-50">
          <div className="text-primary-black-400 pret-xl-semibold mb-4">
            {data.userName ?? "고객"} 고객님
          </div>
          <div className="flex flex-col gap-2 text-black-300 pret-15-medium">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">이사일</span>
              <span className="text-black-400">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">출발</span>
              <span className="text-black-400">{data.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">도착</span>
              <span className="text-black-400">{data.destination}</span>
            </div>
          </div>
        </div>

        {/* 반려 사유 입력 */}
        <div className="w-full">
          <div className="text-primary-black-400 pret-16-semibold mb-3">
            반려 사유를 입력해 주세요
          </div>
          <textarea
            className="w-full min-h-[140px] rounded-xl border border-line-100 bg-background-100 px-4 py-3 text-black-300 pret-15-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue-200"
            placeholder="최소 10자 이상 입력해주세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="text-right text-gray-300 pret-13-medium mt-1">
            {reason.trim().length}자 / 최소 10자
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button
          text="반려하기"
          variant="solid"
          width="100%"
          disabled={disabled}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

