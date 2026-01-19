"use client";

import { useRouter } from "next/navigation";
import MoveTypeSelect from "@/app/quote/request/_components/MoveTypeSelect";
import { useQuoteRequestStore } from "@/app/quote/request/store";
import type { MovingType } from "@/app/quote/request/store";

const OPTIONS = [
  { value: "소형이사", title: "소형이사", desc: "(원룸, 투룸, 20평대 미만)" },
  { value: "가정이사", title: "가정이사", desc: "(쓰리룸, 20평대 이상)" },
  { value: "사무실이사", title: "사무실이사", desc: "(사무실, 상업공간)" },
] satisfies Array<{ value: MovingType; title: string; desc: string }>;

export default function QuoteRequestTypePage() {
  const router = useRouter();

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const setMovingType = useQuoteRequestStore((s) => s.setMovingType);
  const setStep = useQuoteRequestStore((s) => s.setStep);

  const handleConfirm = () => {
    if (!movingType) return;
    setStep(2);
    router.push("/quote/request/date");
  };

  return (
    // ✅ 페이지 자체는 배경을 깔지 않는다 (body가 회색이므로)
    <main className="mx-auto w-full max-w-[1200px] px-4 md:px-10 py-8 md:py-12">
      {/* 상단 타이틀 + 진행바 */}
      <section className="mb-10">
        <h1 className="mb-4 text-[18px] font-semibold text-[#111]">견적요청</h1>
        <div className="h-[6px] w-full rounded-full bg-[#E6E6E6]">
          <div className="h-[6px] w-[28%] rounded-full bg-[#2E7BFF]" />
        </div>
      </section>
      {/* 채팅 플로우 */}
      <section className="flex flex-col gap-6">
        {/* 왼쪽 말풍선 */}
        <div className="pt-14">
          <div className="inline-flex max-w-[520px] rounded-full bg-white px-6 py-4 text-[14px] text-[#111] shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
            몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
          </div>

          <div className="h-4" />

          <div className="inline-flex max-w-[520px] rounded-full bg-white px-6 py-4 text-[14px] text-[#111] shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
            이사 종류를 선택해 주세요.
          </div>
        </div>

        {/* 오른쪽 선택지 카드 */}
        <div className="self-end w-[520px] border-radius-[32px 0 32px 32px]">
          <MoveTypeSelect
            options={OPTIONS}
            value={movingType ?? null}
            onChange={setMovingType}
            onConfirm={handleConfirm}
            confirmDisabled={!movingType}
          />
        </div>
      </section>
    </main>
  );
}
