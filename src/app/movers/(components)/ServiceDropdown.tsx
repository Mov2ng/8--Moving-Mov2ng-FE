"use client";

import React, { useState } from "react";
import FilterDropdown from "@/components/common/FilterDropdown";

export default function ServiceDropdown({ selectedService, setSelectedService }: { selectedService: string, setSelectedService: (service: string) => void }) {
  const serviceList = ["전체", "소형이사", "가정이사", "사무실이사"];

  const onClickService = (menu: string) => {
    setSelectedService(menu);
  };

  return (
    <FilterDropdown
      menuName={selectedService ? selectedService : "서비스"}
      menuList={serviceList}
      onClick={onClickService}
    />
  );
}
