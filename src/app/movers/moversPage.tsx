"use client";

import React, { useState } from "react";
import Toast from "@/components/common/Toast";
import Search from "@/components/common/Search";
import FilterDropdown from "@/components/common/FilterDropdown";
import SortDropdown from "@/components/common/SortDropdown";

export default function MoversPage() {
  const sortList = ["리뷰 많은순", "평점 높은순", "경력 높은순", "확정 높은순"];

  return (
    <div>
      <Toast content="링크가 복사되었어요" info={true} />
      <Search />
      <FilterDropdown />
      <SortDropdown sortList={sortList} sort="리뷰 많은순" />
    </div>
  );
}
