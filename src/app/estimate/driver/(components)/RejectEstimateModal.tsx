"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import Button from "@/components/common/button";
import { formatDateLabel } from "@/utils/date";
import type { DriverRequestDetail } from "@/types/api/driverRequest";
import { useI18n } from "@/libs/i18n/I18nProvider";

interface RejectEstimateModalProps {
  open: boolean;
  onClose: () => void;
  data: DriverRequestDetail | null;
  onSubmit: (payload: { requestReason: string }) => void;
  isSubmitting?: boolean;
  isDesignated?: boolean;
}

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
  const { t } = useI18n();
  const [reason, setReason] = useState("");

  const movingTypeMap: Record<string, string> = {
    SMALL: t("moving_type_small"),
    HOME: t("moving_type_home"),
    HOUSE: t("moving_type_home"),
    OFFICE: t("moving_type_office"),
  };

  const movingTypeLabel = useMemo(() => {
    if (!data?.movingType) return "";
    return movingTypeMap[data.movingType] ?? data.movingType;
  }, [data, movingTypeMap]);

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
            {t("driver_received_reject_title")}
          </div>
          <button
            type="button"
            aria-label={t("close")}
            onClick={handleClose}
            className="text-gray-300 hover:text-black-300 cursor-pointer"
          >
            <Image
              src="/assets/icon/ic-cancel.svg"
              alt={t("close")}
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
              label={t("designated_quote_full")}
              iconSrc="/assets/icon/ic-File-dock-fill.svg"
              size="sm"
              variant="rd"
            />
          )}
        </div>

        {/* 고객 정보 박스 */}
        <div className="w-full border border-line-100 rounded-xl p-4 bg-gray-50">
          <div className="text-primary-black-400 pret-xl-semibold mb-4">
            {data.userName ?? t("driver_received_customer")} {t("customer_suffix")}
          </div>
          <div className="flex flex-col gap-2 text-black-300 pret-15-medium">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("moving_date_label")}</span>
              <span className="text-black-400">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("departure_short")}</span>
              <span className="text-black-400">{data.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("arrival_short")}</span>
              <span className="text-black-400">{data.destination}</span>
            </div>
          </div>
        </div>

        {/* 반려 사유 입력 */}
        <div className="w-full">
          <div className="text-primary-black-400 pret-16-semibold mb-3">
            {t("driver_received_reject_reason_label")}
          </div>
          <textarea
            className="w-full min-h-[140px] rounded-xl border border-line-100 bg-background-100 px-4 py-3 text-black-300 pret-15-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue-200"
            placeholder={t("driver_received_send_estimate_comment_placeholder")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="text-right text-gray-300 pret-13-medium mt-1">
            {reason.trim().length}{t("driver_received_send_estimate_comment_counter")}
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button
          text={t("driver_received_reject_submit")}
          variant="solid"
          width="100%"
          disabled={disabled}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

