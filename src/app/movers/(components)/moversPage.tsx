"use client";

import React, { useState } from "react";
import Toast from "@/components/common/Toast";
import Search from "@/components/common/Search";
import SortDropdown from "@/components/common/SortDropdown";
import ServiceDropdown from "./ServiceDropdown";
import RegionDropdown from "./RegionDropdown";
import DriverList from "./DriverList";

export default function MoversPage() {
  const sortList = ["리뷰 많은순", "평점 높은순", "경력 높은순", "확정 높은순"];

  return (
    <div>
      <Toast content="링크가 복사되었어요" info={true} />
      <Search />
      <SortDropdown sortList={sortList} sort="리뷰 많은순" />
      <ServiceDropdown />
      <RegionDropdown />
      <div className="mt-5"></div>
      <DriverList size="md" />
      <div className="mt-5"></div>
      <DriverList size="sm" />
    </div>
  );
}
