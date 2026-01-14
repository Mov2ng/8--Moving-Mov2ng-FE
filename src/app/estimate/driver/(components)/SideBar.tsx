import React from "react";

export const Sidebar: React.FC<{
  movingTypeFilter?: string[];
  onMovingTypeFilterChange?: (filters: string[]) => void;
  isDesignatedFilter?: boolean | undefined;
  onIsDesignatedFilterChange?: (value: boolean | undefined) => void;
}> = ({
  movingTypeFilter = [],
  onMovingTypeFilterChange,
  isDesignatedFilter,
  onIsDesignatedFilterChange,
}) => {
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

  return (
    <aside className="w-[240px] flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
          이사 유형
        </h3>
        <ul className="space-y-3">
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
              소형이사
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
              가정이사
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
              사무실이사
            </label>
          </li>
        </ul>

        <div className="h-px bg-gray-200 my-5" />

        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
          필터
        </h3>
        <ul className="space-y-3">
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
              지정 견적 요청
            </label>
          </li>
        </ul>
      </div>
    </aside>
  );
};