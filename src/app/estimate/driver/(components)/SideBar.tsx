import React, { useMemo, useRef } from "react";
import { useI18n } from "@/libs/i18n/I18nProvider";

export const Sidebar: React.FC<{
  movingTypeFilter?: string[];
  onMovingTypeFilterChange?: (filters: string[]) => void;
  isDesignatedFilter?: boolean | undefined;
  onIsDesignatedFilterChange?: (value: boolean | undefined) => void;
  regionFilter?: boolean;
  onRegionFilterChange?: (value: boolean) => void;
  items?: Array<{ movingType?: string | null; isDesignated?: boolean | null }>;
}> = ({
  movingTypeFilter = [],
  onMovingTypeFilterChange,
  isDesignatedFilter,
  onIsDesignatedFilterChange,
  regionFilter = false,
  onRegionFilterChange,
  items = [],
}) => {
  const { t } = useI18n();
  // 이전 카운트 값을 유지하기 위한 ref
  const prevCountsRef = useRef({
    small: 0,
    home: 0,
    office: 0,
    designated: 0,
    region: 0,
  });

  // 개수 계산
  const counts = useMemo(() => {
    // items가 비어있으면 이전 값을 유지
    if (!items || items.length === 0) {
      return prevCountsRef.current;
    }

    const smallCount = items.filter((item) => item.movingType === "SMALL").length;
    const homeCount = items.filter(
      (item) => item.movingType === "HOME" || item.movingType === "HOUSE"
    ).length;
    const officeCount = items.filter((item) => item.movingType === "OFFICE").length;
    const designatedCount = items.filter((item) => item.isDesignated === true).length;
    const regionCount = items.length; // 서비스 가능 지역은 전체로 가정

    const newCounts = {
      small: smallCount,
      home: homeCount,
      office: officeCount,
      designated: designatedCount,
      region: regionCount,
    };

    // 이전 값 업데이트
    prevCountsRef.current = newCounts;

    return newCounts;
  }, [items]);

  const handleMovingTypeChange = (type: string, checked: boolean) => {
    if (!onMovingTypeFilterChange) return;
    if (checked) {
      onMovingTypeFilterChange([...movingTypeFilter, type]);
    } else {
      onMovingTypeFilterChange(
        movingTypeFilter.filter((t) => t !== type)
      );
    }
  };

  const handleDesignatedChange = (checked: boolean) => {
    if (!onIsDesignatedFilterChange) return;
    onIsDesignatedFilterChange(checked ? true : undefined);
  };

  const handleSelectAllMovingType = (checked: boolean) => {
    if (!onMovingTypeFilterChange) return;
    if (checked) {
      onMovingTypeFilterChange(["SMALL", "HOME", "OFFICE"]);
    } else {
      onMovingTypeFilterChange([]);
    }
  };

  const handleSelectAllFilter = (checked: boolean) => {
    if (!onIsDesignatedFilterChange) return;
    onIsDesignatedFilterChange(checked ? true : undefined);
  };

  const allMovingTypesSelected =
    movingTypeFilter.includes("SMALL") &&
    movingTypeFilter.includes("HOME") &&
    movingTypeFilter.includes("OFFICE");

  return (
    <aside className="w-[240px] flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
          {t("driver_received_moving_type")}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="all-moving"
              checked={allMovingTypesSelected}
              onChange={(e) => handleSelectAllMovingType(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label htmlFor="all-moving" className="text-[14px] text-gray-700 flex-1">
              {t("driver_received_select_all")}
            </label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="small"
              checked={movingTypeFilter.includes("SMALL")}
              onChange={(e) =>
                handleMovingTypeChange("SMALL", e.target.checked)
              }
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label htmlFor="small" className="text-[14px] text-gray-700 flex-1">
              {t("moving_type_small")} ({counts.small})
            </label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="home"
              checked={movingTypeFilter.includes("HOME") || movingTypeFilter.includes("HOUSE")}
              onChange={(e) =>
                handleMovingTypeChange("HOME", e.target.checked)
              }
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label htmlFor="home" className="text-[14px] text-gray-700 flex-1">
              {t("moving_type_home")} ({counts.home})
            </label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="office"
              checked={movingTypeFilter.includes("OFFICE")}
              onChange={(e) =>
                handleMovingTypeChange("OFFICE", e.target.checked)
              }
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label htmlFor="office" className="text-[14px] text-gray-700 flex-1">
              {t("moving_type_office")} ({counts.office})
            </label>
          </li>
        </ul>

        <div className="h-px bg-gray-200 my-5" />

        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
          {t("filter")}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="all-filter"
              checked={isDesignatedFilter === true}
              onChange={(e) => handleSelectAllFilter(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label htmlFor="all-filter" className="text-[14px] text-gray-700 flex-1">
              {t("driver_received_select_all")}
            </label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="region"
              checked={regionFilter}
              onChange={(e) => onRegionFilterChange?.(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label htmlFor="region" className="text-[14px] text-gray-700 flex-1">
              {t("driver_received_service_available")} ({counts.region})
            </label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              id="designated"
              checked={isDesignatedFilter === true}
              onChange={(e) => handleDesignatedChange(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <label
              htmlFor="designated"
              className="text-[14px] text-gray-700 flex-1"
            >
              {t("designated_quote_full")} ({counts.designated})
            </label>
          </li>
        </ul>
      </div>
    </aside>
  );
};