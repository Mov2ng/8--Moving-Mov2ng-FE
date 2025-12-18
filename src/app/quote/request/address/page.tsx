"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuoteRequestStore } from "../store";

export default function QuoteRequestAddressPage() {
  const router = useRouter();

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const date = useQuoteRequestStore((s) => s.date);

  const address = useQuoteRequestStore((s) => s.address);
  const setAddress = useQuoteRequestStore((s) => s.setAddress);
  const setStep = useQuoteRequestStore((s) => s.setStep);

  const disabledBecauseMissingPrev = !movingType || !date;

  const [value, setValue] = useState<string>(() => address ?? "");

  const canNext = useMemo(() => {
    return value.trim().length > 0 && !disabledBecauseMissingPrev;
  }, [value, disabledBecauseMissingPrev]);

  const handleConfirm = () => {
    if (!canNext) return;
    setAddress(value.trim());
    setStep(4);
    router.push("/quote/request/progress");
  };

  return (
    <main className="mx-auto max-w-[720px] px-6 py-10">
      <h1 className="mb-6 text-[18px] font-semibold">주소 입력</h1>

      {disabledBecauseMissingPrev && (
        <div className="mb-6 rounded-xl bg-[#FFF3CD] px-4 py-3 text-[14px] text-[#664D03]">
          이전 단계(이사 종류/날짜)를 먼저 입력해 주세요.
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="underline"
              onClick={() => router.push("/quote/request/type")}
            >
              이사 종류로
            </button>
            <button
              type="button"
              className="underline"
              onClick={() => router.push("/quote/request/date")}
            >
              날짜로
            </button>
          </div>
        </div>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <label className="block text-[14px] font-semibold">주소</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-[#E5E7EB] px-4 text-[14px]"
          placeholder="예) 서울시 강남구 ..."
          disabled={disabledBecauseMissingPrev}
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canNext}
          className={[
            "mt-6 h-12 w-full rounded-xl text-[14px] font-semibold",
            canNext
              ? "bg-[#111] text-white"
              : "cursor-not-allowed bg-[#D9D9D9] text-white",
          ].join(" ")}
        >
          선택완료
        </button>
      </section>
    </main>
  );
}
