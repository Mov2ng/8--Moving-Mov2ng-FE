"use client";

import React, { useState } from "react";
import FilterDropdown from "@/components/common/FilterDropdown";

import type { QuerySelectType } from "@/types/queryType";

export default function ServiceDropdown({
  serviceList,
  selectedService,
  setSelectedService,
}: {
  serviceList: QuerySelectType[];
  selectedService: QuerySelectType;
  setSelectedService: (service: QuerySelectType) => void;
}) {
  
  const onClickService = (menu: QuerySelectType) => {
    setSelectedService(menu);
  };

  return (
    <FilterDropdown
      menuName={selectedService.label}
      menuList={serviceList}
      onClick={onClickService}
    />
  );
}
