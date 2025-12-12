import FilterDropdown from "@/components/common/FilterDropdown";
import React, { useState } from "react";


export const areaNames1 = [
  "전체",
  "서울",
  "경기",
  "인천",
  "대전",
  "세종",
  "대구",
  "부산",
  "울산",
];
export const areaNames2 = [
  "광주",
  "강원",
  "충북",
  "충남",
  "경북",
  "경남",
  "전북",
  "전남",
  "제주",
];


export default function RegionDropdown({ selectedRegion, setSelectedRegion }: { selectedRegion: string, setSelectedRegion: (region: string) => void }) {
  const onClickRegion = (menu: string) => {
    setSelectedRegion(menu);
  };

  return (
    <FilterDropdown
      menuName={selectedRegion ? selectedRegion : "지역"}
      menuList={areaNames1}
      menuSubList={areaNames2}
      onClick={onClickRegion}
    />
  );
}
