"use client";

import { useRouter } from "next/navigation";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { useQuoteRequestStore } from "../store";

const TYPES = [
  { label: "소형이사", iconSrc: "/icons/box.svg" },
  { label: "가정이사", iconSrc: "/icons/home.svg" },
  { label: "사무실이사", iconSrc: "/icons/office.svg" },
] as const;

export default function Page() {
  const router = useRouter();
  const { setMovingType } = useQuoteRequestStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <p className="text-gray-600 text-sm">
          몇 가지만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
        </p>
        <h3 className="text-lg font-semibold">이사 종류를 선택해 주세요.</h3>
      </div>

      <div className="flex flex-col gap-3">
        {TYPES.map((t) => (
          <MovingTypeChip
            key={t.label}
            label={t.label}
            iconSrc={t.iconSrc}
            size="md"
            variant="bl"
            onClick={() => {
              setMovingType(t.label);
              router.push("/quote/request/date");
            }}
          />
        ))}
      </div>
    </div>
  );
}
