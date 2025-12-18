"use client";

import { useRouter } from "next/navigation";
import { useQuoteRequestStore, type MovingType } from "../store";

const OPTIONS: Array<{
  value: MovingType;
  title: string;
  desc: string;
}> = [
  { value: "소형이사", title: "소형이사", desc: "(원룸, 투룸, 20평대 미만)" },
  { value: "가정이사", title: "가정이사", desc: "(쓰리룸, 20평대 이상)" },
  { value: "사무실이사", title: "사무실이사", desc: "(사무실, 상업공간)" },
];

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
    <main className="mx-auto w-full max-w-[1200px] px-10 py-12">
      {/* 상단 타이틀 + 프로그레스 바(지금은 임시 스타일) */}
      <section className="mb-10">
        <h1 className="mb-4 text-[18px] font-semibold text-[#111]">견적요청</h1>
        <div className="h-[6px] w-full rounded-full bg-[#E6E6E6]">
          <div className="h-[6px] w-[28%] rounded-full bg-[#2E7BFF]" />
        </div>
      </section>

      {/* 본문 2컬럼 */}
      <section className="grid grid-cols-[1fr_520px] gap-12 items-start">
        {/* 왼쪽 말풍선 */}
        <div className="pt-14">
          <Bubble>
            몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
          </Bubble>
          <div className="h-4" />
          <Bubble>이사 종류를 선택해 주세요.</Bubble>
        </div>

        {/* 오른쪽 선택 카드 */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-4">
            {OPTIONS.map((opt) => {
              const selected = movingType === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMovingType(opt.value)}
                  className={[
                    "w-full rounded-xl border px-5 py-5 text-left transition",
                    selected
                      ? "border-[#2E7BFF] ring-2 ring-[#2E7BFF]/20"
                      : "border-[#EAEAEA] hover:border-[#CFCFCF]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4">
                    {/* 라디오 동그라미 */}
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        selected ? "border-[#2E7BFF]" : "border-[#CFCFCF]",
                      ].join(" ")}
                      aria-hidden
                    >
                      {selected && (
                        <span className="h-3 w-3 rounded-full bg-[#2E7BFF]" />
                      )}
                    </span>

                    <div className="text-[14px] text-[#111]">
                      <span className="font-semibold">{opt.title}</span>{" "}
                      <span className="text-[#666]">{opt.desc}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!movingType}
            className={[
              "mt-6 h-[52px] w-full rounded-xl text-[14px] font-semibold transition",
              movingType
                ? "bg-[#111] text-white hover:bg-[#000]"
                : "cursor-not-allowed bg-[#D9D9D9] text-white",
            ].join(" ")}
          >
            선택완료
          </button>
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
