import React from "react";
import Image from "next/image";

export const SearchBar: React.FC<{
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  sort?: "soonest" | "recent";
  onSortChange?: (sort: "soonest" | "recent") => void;
}> = ({
  searchQuery = "",
  onSearchQueryChange,
  sort = "soonest",
  onSortChange,
}) => {
  return (
    <div className="p-5 border-b border-gray-200">
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
            placeholder="어떤 고객님을 찾고 계세요?"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() =>
              onSortChange?.(sort === "soonest" ? "recent" : "soonest")
            }
            className="px-4 h-10 text-[14px] text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            {sort === "soonest" ? "이사 빠른순" : "요청일 빠른순"}{" "}
            <span className="text-blue-500">▼</span>
          </button>
        </div>
      </div>
    </div>
  );
};