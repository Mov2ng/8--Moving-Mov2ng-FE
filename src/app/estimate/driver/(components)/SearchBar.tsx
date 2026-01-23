import React from "react";
import Image from "next/image";
import { useI18n } from "@/libs/i18n/I18nProvider";

export const SearchBar: React.FC<{
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  sort?: "soonest" | "recent";
  onSortChange?: (sort: "soonest" | "recent") => void;
  totalCount?: number;
  onFilterClick?: () => void;
  hasActiveFilter?: boolean;
}> = ({
  searchQuery = "",
  onSearchQueryChange,
  sort = "soonest",
  onSortChange,
  totalCount = 0,
  onFilterClick,
  hasActiveFilter = false,
}) => {
  const { t } = useI18n();
  
  return (
    <div className="p-5 border-b border-gray-200">
      <div className="flex flex-col gap-4">
        {/* 검색 바 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Image
              src="/assets/icon/ic-search.svg"
              alt=""
              width={16}
              height={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              placeholder={t("driver_received_search_placeholder")}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange?.(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* 모바일: 필터 버튼 */}
          <button
            onClick={onFilterClick}
            className={`md:hidden px-4 h-10 text-[14px] border rounded-lg flex items-center gap-2 transition-colors ${
              hasActiveFilter
                ? "border-blue-500 bg-blue-50 text-blue-500"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("driver_received_filter")}
          </button>
        </div>
        
        {/* 전체 카운트 및 정렬/필터 */}
        <div className="flex items-center justify-between">
          <div className="text-[14px] text-gray-700">
            {t("driver_received_total")} {totalCount}건
          </div>
          <div className="flex items-center gap-2">
            {/* 정렬 버튼 */}
            <button
              onClick={() =>
                onSortChange?.(sort === "soonest" ? "recent" : "soonest")
              }
              className="px-4 h-10 text-[14px] text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              {sort === "soonest" ? t("driver_received_sort_soonest") : t("driver_received_sort_recent")}{" "}
              <Image
                src="/assets/icon/ic-chevron-down.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </button>
            {/* 태블릿: 필터 버튼 */}
            <button
              onClick={onFilterClick}
              className={`hidden md:flex px-4 h-10 text-[14px] border rounded-lg items-center gap-2 transition-colors ${
                hasActiveFilter
                  ? "border-blue-500 bg-blue-50 text-blue-500"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("driver_received_filter")}
            </button>
            {/* 필터 아이콘 버튼 (모바일) */}
            <button
              onClick={onFilterClick}
              className="md:hidden p-2 h-10 w-10 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <Image
                src="/assets/icon/ic-filter.svg"
                alt="filter"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};