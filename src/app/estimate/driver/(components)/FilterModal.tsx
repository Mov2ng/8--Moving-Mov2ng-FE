"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/libs/i18n/I18nProvider";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  movingTypeFilter: string[];
  onMovingTypeFilterChange: (filters: string[]) => void;
  isDesignatedFilter: boolean | undefined;
  onIsDesignatedFilterChange: (value: boolean | undefined) => void;
  regionFilter: boolean;
  onRegionFilterChange: (value: boolean) => void;
  items: Array<{ movingType?: string | null; isDesignated?: boolean | null }>;
  onApply: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  movingTypeFilter,
  onMovingTypeFilterChange,
  isDesignatedFilter,
  onIsDesignatedFilterChange,
  regionFilter,
  onRegionFilterChange,
  items = [],
  onApply,
}) => {
  const { t } = useI18n();
  const prevCountsRef = useRef({
    small: 0,
    home: 0,
    office: 0,
    designated: 0,
    region: 0,
    total: 0,
  });

  // 개수 계산
  const counts = useMemo(() => {
    if (!items || items.length === 0) {
      return prevCountsRef.current;
    }

    const smallCount = items.filter((item) => item.movingType === "SMALL").length;
    const homeCount = items.filter(
      (item) => item.movingType === "HOME" || item.movingType === "HOUSE"
    ).length;
    const officeCount = items.filter((item) => item.movingType === "OFFICE").length;
    const designatedCount = items.filter((item) => item.isDesignated === true).length;
    const regionCount = items.length;
    const totalCount = items.length;

    const newCounts = {
      small: smallCount,
      home: homeCount,
      office: officeCount,
      designated: designatedCount,
      region: regionCount,
      total: totalCount,
    };

    prevCountsRef.current = newCounts;
    return newCounts;
  }, [items]);

  const handleMovingTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      onMovingTypeFilterChange([...movingTypeFilter, type]);
    } else {
      onMovingTypeFilterChange(movingTypeFilter.filter((t) => t !== type));
    }
  };

  const handleDesignatedChange = (checked: boolean) => {
    onIsDesignatedFilterChange(checked ? true : undefined);
  };

  const handleSelectAllMovingType = (checked: boolean) => {
    if (checked) {
      onMovingTypeFilterChange(["SMALL", "HOME", "OFFICE"]);
    } else {
      onMovingTypeFilterChange([]);
    }
  };

  const allMovingTypesSelected =
    movingTypeFilter.includes("SMALL") &&
    movingTypeFilter.includes("HOME") &&
    movingTypeFilter.includes("OFFICE");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* overlay */}
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* modal */}
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-gray-900">
            {t("driver_received_moving_type")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="close"
          >
            <Image
              src="/assets/icon/ic-cancel.svg"
              alt="close"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Tablet: 이사 유형 필터 */}
          <div className="hidden md:block">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-all-moving"
                  checked={allMovingTypesSelected}
                  onChange={(e) => handleSelectAllMovingType(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-all-moving"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("driver_received_select_all")} ({counts.total})
                </label>
              </li>
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-small"
                  checked={movingTypeFilter.includes("SMALL")}
                  onChange={(e) => handleMovingTypeChange("SMALL", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-small"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("moving_type_small")} ({counts.small})
                </label>
              </li>
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-home"
                  checked={
                    movingTypeFilter.includes("HOME") || movingTypeFilter.includes("HOUSE")
                  }
                  onChange={(e) => handleMovingTypeChange("HOME", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-home"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("moving_type_home")} ({counts.home})
                </label>
              </li>
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-office"
                  checked={movingTypeFilter.includes("OFFICE")}
                  onChange={(e) => handleMovingTypeChange("OFFICE", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-office"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("moving_type_office")} ({counts.office})
                </label>
              </li>
            </ul>
          </div>

          {/* Mobile: 서비스 가능 지역, 지정 견적 요청 */}
          <div className="block md:hidden">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-mobile-all"
                  checked={regionFilter && isDesignatedFilter === true}
                  onChange={(e) => {
                    onRegionFilterChange(e.target.checked);
                    onIsDesignatedFilterChange(e.target.checked ? true : undefined);
                  }}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-mobile-all"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("driver_received_select_all")} ({counts.total})
                </label>
              </li>
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-region"
                  checked={regionFilter}
                  onChange={(e) => onRegionFilterChange(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-region"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("driver_received_service_available")} ({counts.region})
                </label>
              </li>
              <li className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modal-designated"
                  checked={isDesignatedFilter === true}
                  onChange={(e) => handleDesignatedChange(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="modal-designated"
                  className="text-[14px] text-gray-700 flex-1 cursor-pointer"
                >
                  {t("designated_quote_full")} ({counts.designated})
                </label>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-full h-12 bg-blue-500 text-white rounded-lg font-semibold text-[14px] hover:bg-blue-600 transition-colors"
          >
            조회하기
          </button>
        </div>
      </div>
    </div>
  );
};

