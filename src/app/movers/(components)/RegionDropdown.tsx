import FilterDropdown from "@/components/common/FilterDropdown";
import React, { useState } from "react";
import type { QuerySelectType } from "@/types/queryType";


export default function RegionDropdown({ regionList, selectedRegion, setSelectedRegion }: 
  { regionList: QuerySelectType[], selectedRegion: QuerySelectType, setSelectedRegion: (region: QuerySelectType) => void }) {
 
  const onClickRegion = (menu: QuerySelectType) => {
    setSelectedRegion(menu);
  };

  return (
    <FilterDropdown
      menuName={selectedRegion.label}
      menuList={regionList}
      onClick={onClickRegion}
    />
  );
}
