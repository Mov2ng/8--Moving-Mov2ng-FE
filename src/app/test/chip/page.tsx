"use client";

import { useState } from "react";
import RegionChip from "../../../components/chips/RegionChip";

export default function ChipTestPage() {
  const [selected, setSelected] = useState("소형이사");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center gap-3">
      <RegionChip
        label="서울"
        size="sm"
        selected={selected === "서울"}
        onClick={() => setSelected("서울")}
      />

      <RegionChip
        label="소형이사"
        size="sm"
        selected={selected === "소형이사"}
        onClick={() => setSelected("소형이사")}
      />

      <RegionChip
        label="서울"
        size="md"
        selected={selected === "서울"}
        onClick={() => setSelected("서울")}
      />

      <RegionChip
        label="소형이사"
        size="md"
        selected={selected === "소형이사"}
        onClick={() => setSelected("소형이사")}
      />
    </div>
  );
}
