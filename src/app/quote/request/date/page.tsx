"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import DatePicker from "@/components/DatePicker/DatePicker"; // ✅ 너가 만든 컴포넌트 경로
import { useQuoteRequestStore } from "../store";

export default function QuoteRequestDatePage() {
  const router = useRouter();

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const savedDate = useQuoteRequestStore((s) => s.date);
  const setDate = useQuoteRequestStore((s) => s.setDate);
  const setStep = useQuoteRequestStore((s) => s.setStep);

  // type 안 고르고 들어오면 막기
  const disabledBecauseMissingPrev = !movingType;

  // DatePicker가 value: Date | null을 받는다고 가정
  const [value, setValue] = useState<Date | null>(savedDate ?? null);

  const canNext = useMemo(() => {
    return !!value && !disabledBecauseMissingPrev;
  }, [value, disabledBecauseMissingPrev]);

  const handleConfirm = () => {
    if (!canNext || !value) return;
    setDate(value);
    setStep(3);
    router.push("/quote/request/address");
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-10 py-12">
      <section className="grid grid-cols-[1fr_520px] gap-12 items-start">
        {/* 왼쪽 말풍선 */}
        <div className="pt-14">
          <Bubble>이사 예정일을 선택해 주세요.</Bubble>
        </div>

        {/* 오른쪽 카드 */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          {/* ✅ 기존 DatePicker 컴포넌트 사용 */}
          <DatePicker
            size="md"
            value={value}
            onChange={(date) => setValue(date)}
          />

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canNext}
            className={[
              "mt-6 h-[52px] w-full rounded-xl text-[14px] font-semibold transition",
              canNext
                ? "bg-[#111] text-white hover:bg-[#000]"
                : "cursor-not-allowed bg-[#D9D9D9] text-white",
            ].join(" ")}
          >
            선택완료
          </button>

          {disabledBecauseMissingPrev && (
            <p className="mt-3 text-[12px] text-[#666]">
              이사 종류를 먼저 선택해 주세요.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex max-w-[520px] rounded-full bg-white px-6 py-4 text-[14px] text-[#111] shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}
