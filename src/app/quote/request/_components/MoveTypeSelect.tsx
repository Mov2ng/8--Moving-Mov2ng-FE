"use client";

import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { useQuoteRequestStore, type MovingType } from "../store";

type Variant = "bl" | "rd" | "gr";

const OPTIONS: Array<{
  value: MovingType;
  label: string;
  iconSrc: string;
  selectedVariant: Exclude<Variant, "gr">;
}> = [
  {
    value: "소형이사",
    label: "소형이사",
    iconSrc: "/icons/move-small.svg",
    selectedVariant: "bl",
  },
  {
    value: "가정이사",
    label: "가정이사",
    iconSrc: "/icons/move-home.svg",
    selectedVariant: "rd",
  },
  {
    value: "사무실이사",
    label: "사무실이사",
    iconSrc: "/icons/move-office.svg",
    selectedVariant: "bl",
  },
];

export default function MoveTypeSelect() {
  const movingType = useQuoteRequestStore((s) => s.movingType);
  const setMovingType = useQuoteRequestStore((s) => s.setMovingType);

  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map((opt) => {
        const selected = movingType === opt.value;
        const variant: Variant = selected ? opt.selectedVariant : "gr";

        return (
          <MovingTypeChip
            key={opt.value}
            label={opt.label}
            iconSrc={opt.iconSrc}
            size="md"
            variant={variant}
            onClick={() => setMovingType(opt.value)}
          />
        );
      })}
    </div>
  );
}
