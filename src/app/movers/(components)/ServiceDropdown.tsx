"use client";

import React, { useState } from "react";
import FilterDropdown from "@/components/common/FilterDropdown";

export default function ServiceDropdown() {
  const [selectedService, setSelectedService] = useState<string>("서비스");
  const serviceList = ["전체", "소형이사", "가정이사", "사무실이사"];

  const onClickService = (menu: string) => {
    setSelectedService(menu);
  };

  return <><FilterDropdown menuName={selectedService ? selectedService : "서비스"} menuList={serviceList} onClick={onClickService} /></>;
}