"use client";

import React from "react";
import Toast from "@/components/common/Toast";
import Search from "@/components/common/Search";

export default function MoversPage() {
  return (
    <div>
      <Toast content="링크가 복사되었어요" info={true} />
      <Search />
    </div>
  );
}
