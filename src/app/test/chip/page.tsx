"use client";

import { useState } from "react";
import RegionChip from "../../../components/chips/RegionChip";
import MovingTypeChip from "../../../components/chips/MovingTypeChip";
import AddressChip from "../../../components/chips/AddressChip";

export default function ChipTestPage() {
  const [selected, setSelected] = useState("소형이사");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center gap-6">
      {/* RegionChip 테스트 */}
      <div className="flex gap-3">
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

      {/* MovingTypeChip 테스트 */}
      <div className="flex flex-col gap-3">
        {/* sm 줄 */}
        <div className="flex gap-2">
          <MovingTypeChip
            size="sm"
            variant="bl"
            label="소형이사"
            iconSrc="/icons/box.svg"
          />
          <MovingTypeChip
            size="sm"
            variant="bl"
            label="가정이사"
            iconSrc="/icons/home.svg"
          />
          <MovingTypeChip
            size="sm"
            variant="bl"
            label="사무실이사"
            iconSrc="/icons/office.svg"
          />
          <MovingTypeChip
            size="sm"
            variant="rd"
            label="지정 견적 요청"
            iconSrc="/icons/redfile.svg"
          />
          <MovingTypeChip size="sm" variant="gr" label="견적 대기" iconSrc="" />
        </div>

        {/* md 줄 */}
        <div className="flex gap-2">
          <MovingTypeChip
            size="md"
            variant="bl"
            label="소형이사"
            iconSrc="/icons/box.svg"
          />
          <MovingTypeChip
            size="md"
            variant="bl"
            label="가정이사"
            iconSrc="/icons/home.svg"
          />
          <MovingTypeChip
            size="md"
            variant="bl"
            label="사무실이사"
            iconSrc="/icons/office.svg"
          />
          <MovingTypeChip
            size="md"
            variant="rd"
            label="지정 견적 요청"
            iconSrc="/icons/redfile.svg"
          />
          <MovingTypeChip size="md" variant="gr" label="견적 대기" iconSrc="" />
        </div>
        {/* AddressChip 테스트 */}
        <div className="flex gap-2">
          <AddressChip label="도로명" size="sm" />
          <AddressChip label="도로명" size="md" />
        </div>
      </div>
    </div>
  );
}
