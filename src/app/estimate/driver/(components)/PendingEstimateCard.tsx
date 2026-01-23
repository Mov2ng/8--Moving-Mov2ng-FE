"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { formatDateLabel } from "@/utils/date";
import type { DriverRequest } from "@/types/api/driverRequest";
import { useI18n } from "@/libs/i18n/I18nProvider";

const movingTypeIconMap: Record<string, string> = {
  SMALL: "/assets/icon/ic-box.svg",
  HOME: "/assets/icon/ic-home-fill.svg",
  HOUSE: "/assets/icon/ic-home-fill.svg",
  OFFICE: "/assets/icon/ic-office-fill.svg",
};

export type PendingEstimateItem = DriverRequest & {
  estimatePrice?: number | null;
  isCompleted?: boolean;
};

interface PendingEstimateCardProps {
  item: PendingEstimateItem;
  isRejected?: boolean;
}

export default function PendingEstimateCard({
  item,
  isRejected = false,
}: PendingEstimateCardProps) {
  const { t } = useI18n();
  
  if (!item) return null;

  const movingTypeMap: Record<string, string> = {
    SMALL: t("moving_type_small"),
    HOME: t("moving_type_home"),
    HOUSE: t("moving_type_home"),
    OFFICE: t("moving_type_office"),
  };

  const movingTypeLabel = movingTypeMap[item.movingType] ?? item.movingType;
  const movingTypeIcon = movingTypeIconMap[item.movingType] ?? "/assets/icon/ic-box.svg";
  const formattedDate = item.movingDate
    ? formatDateLabel(item.movingDate).replace(/(\d{4})\.(\d{2})\.(\d{2})/, "$1. $2. $3")
    : "-";

  const isCompleted = item.isCompleted || false;
  const estimatePrice = item.estimatePrice ?? 0;

  // 반려 요청 카드 - 일반 카드 위에 오버레이
  if (isRejected) {
    return (
      <div className="relative rounded-xl border border-line-100 p-6 bg-white">
        {/* 검은색 반투명 오버레이 */}
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-10">
          <span className="text-[14px] text-white font-medium">{t("driver_pending_rejected_label")}</span>
        </div>

        {/* 카드 내용 */}
        <div className="relative z-0">
          {/* 태그 영역 */}
          <div className="flex items-center gap-2 mb-4">
            <MovingTypeChip
              label={movingTypeLabel}
              iconSrc={movingTypeIcon}
              size="sm"
              variant="bl"
            />
            {item.isDesignated && (
              <MovingTypeChip
                label={t("designated_quote_full")}
                iconSrc="/assets/icon/ic-File-dock-fill.svg"
                size="sm"
                variant="rd"
              />
            )}
          </div>

          {/* 고객명 */}
          <h4 className="text-[16px] font-semibold text-gray-900 mb-4">
            {item.userName ?? t("driver_received_customer")} {t("customer_suffix")}
          </h4>

          {/* 이사 정보 */}
          <div className="space-y-2 text-[14px]">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("moving_date_label")}</span>
              <span className="text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("departure_short")}</span>
              <span className="text-gray-900">{item.origin ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{t("arrival_short")}</span>
              <span className="text-gray-900">{item.destination ?? "-"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 보낸 견적 카드
  return (
    <div
      className={`rounded-xl border border-line-100 p-6 ${
        isCompleted ? "bg-gray-100" : "bg-white"
      }`}
    >
      {/* 태그 영역 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded">
          {t("driver_pending_estimate_confirmed")}
        </span>
        <MovingTypeChip
          label={movingTypeLabel}
          iconSrc={movingTypeIcon}
          size="sm"
          variant="bl"
        />
        {item.isDesignated && (
          <MovingTypeChip
            label={t("designated_quote_full")}
            iconSrc="/assets/icon/ic-File-dock-fill.svg"
            size="sm"
            variant="rd"
          />
        )}
      </div>

      {/* 고객명 */}
      <h4 className="text-[16px] font-semibold text-gray-900 mb-4">
        {item.userName ?? t("driver_received_customer")} {t("customer_suffix")}
      </h4>

      {/* 완료된 견적 메시지 */}
      {isCompleted && (
        <div className="mb-4 text-center">
          <p className="text-[14px] text-gray-600 mb-3">{t("driver_pending_completed")}</p>
          <Link
            href={`/estimate/driver/pending/${item.estimateId || item.requestId}`}
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-600 transition-colors"
          >
            {t("driver_pending_detail")}
          </Link>
        </div>
      )}

      {/* 이사 정보 */}
      <div className="space-y-2 mb-4 text-[14px]">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{t("moving_date_label")}</span>
          <span className="text-gray-900">{formattedDate}</span>
        </div>
        {!isCompleted && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{t("departure_short")}</span>
            <span className="text-gray-900">{item.origin ?? "-"}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{t("arrival_short")}</span>
          <span className="text-gray-900">{item.destination ?? "-"}</span>
        </div>
      </div>

      {/* 견적 금액 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-[18px] font-bold text-gray-900">
          {t("quote_price")} {estimatePrice.toLocaleString()}{t("currency_won")}
        </p>
      </div>
    </div>
  );
}

