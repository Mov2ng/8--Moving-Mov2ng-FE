"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import DatePicker from "@/components/DatePicker/DatePicker";
import { useQuoteRequestStore } from "@/app/quote/request/store";

export default function QuoteRequestDatePage() {
  const router = useRouter();

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const savedDate = useQuoteRequestStore((s) => s.date);
  const setDate = useQuoteRequestStore((s) => s.setDate);
  const setStep = useQuoteRequestStore((s) => s.setStep);

  const [value, setValue] = useState<Date | null>(savedDate ?? null);

  const canNext = useMemo(() => !!value && !!movingType, [value, movingType]);

  const handleConfirm = () => {
    if (!canNext || !value) return;
    setDate(value);
    setStep(3);
    router.push("/quote/request/address");
  };

  const handleEditMovingType = () => {
    setStep(1);
    router.push("/quote/request/type");
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 md:px-10 py-8 md:py-12">
      {/* 상단 타이틀 + 진행바 */}
      <section className="mb-10">
        <h1 className="mb-4 text-[18px] font-semibold text-[#111]">견적요청</h1>
        <div className="h-[6px] w-full rounded-full bg-[#E6E6E6]">
          <div className="h-[6px] w-[56%] rounded-full bg-[#2E7BFF]" />
        </div>
      </section>

      {/* 채팅 로그 */}
      <section className="flex flex-col gap-8">
        <div className="pt-2">
          <BubbleLeft>
            몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
          </BubbleLeft>
        </div>

        <BubbleLeft>이사 종류를 선택해 주세요.</BubbleLeft>

        <div className="self-center md:self-end md:mr-8 flex flex-col items-center md:items-end gap-2">
          <BubbleRight>{movingType ?? "이사 종류 미선택"}</BubbleRight>
          <button
            type="button"
            onClick={handleEditMovingType}
            className="text-[12px] text-[#8A8A8A] underline underline-offset-2"
          >
            수정하기
          </button>
        </div>

        <BubbleLeft>이사 예정일을 선택해 주세요.</BubbleLeft>

        {/* ✅ 카드 안에는 DatePicker만 (버튼은 DatePicker 내부 파란 버튼 1개) */}
        <div className="self-center md:self-end mr-0 md:mr-8 w-full max-w-[544px] rounded-[24px] bg-white p-4 md:p-[40px] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
          <DatePicker
            size="md"
            value={value}
            onChange={(date) => setValue(date)}
            // ✅ movingType이 없으면 confirm 자체를 비활성화해서(버튼 disabled) 흐름 보장
            onConfirm={movingType ? handleConfirm : undefined}
          />
        </div>
      </section>
    </main>
  );
}

function BubbleLeft({ children }: { children: React.ReactNode }) {
  return (
    <div className="self-start inline-flex max-w-[520px] rounded-full bg-white px-6 py-4 text-[14px] text-[#111] shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}

function BubbleRight({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex max-w-[520px] rounded-full bg-[#2E7BFF] px-6 py-4 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(46,123,255,0.25)]">
      {children}
    </div>
  );
}
