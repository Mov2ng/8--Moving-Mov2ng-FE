"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AddressSearchModal from "@/components/common/AddressSearchModal";
import { useQuoteRequestStore } from "@/app/quote/request/store";

function formatKoreanDate(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}년 ${m}월 ${d}일`;
}

export default function QuoteRequestAddressPage() {
  const router = useRouter();

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const date = useQuoteRequestStore((s) => s.date);
  const setStep = useQuoteRequestStore((s) => s.setStep);

  // ✅ store에 address 하나만 있는 경우(현재 상태)도 일단 유지 가능
  const setAddress = useQuoteRequestStore((s) => s.setAddress);

  // ✅ UI용 state: 출발/도착 각각 저장
  const [from, setFrom] = useState<{
    zonecode: string;
    address: string;
  } | null>(null);
  const [to, setTo] = useState<{ zonecode: string; address: string } | null>(
    null
  );

  // ✅ 모달 제어: 어떤 타입(from/to)으로 열었는지
  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState<"from" | "to">("from");

  const openFrom = () => {
    setTarget("from");
    setModalOpen(true);
  };
  const openTo = () => {
    setTarget("to");
    setModalOpen(true);
  };

  const canNext = useMemo(() => {
    return !!movingType && !!date && !!from && !!to;
  }, [movingType, date, from, to]);

  const handleConfirm = () => {
    if (!canNext || !movingType || !date || !from || !to) return;

    // ✅ store가 address 하나면 일단 합쳐 저장(팀이 store 확장하면 여기만 바꾸면 됨)
    setAddress(
      `from:${from.address}(${from.zonecode})||to:${to.address}(${to.zonecode})`
    );

    setStep(4);
    router.push("/quote/request/progress"); // 다음 단계 경로에 맞게 수정
  };

  const handleEditMovingType = () => {
    setStep(1);
    router.push("/quote/request/type");
  };

  const handleEditDate = () => {
    setStep(2);
    router.push("/quote/request/date");
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-10 py-12">
      {/* 상단 */}
      <section className="mb-10">
        <h1 className="mb-4 text-[18px] font-semibold text-[#111]">견적요청</h1>
        <div className="h-[6px] w-full rounded-full bg-[#E6E6E6]">
          <div className="h-[6px] w-[72%] rounded-full bg-[#2E7BFF]" />
        </div>
      </section>

      {/* 로그 */}
      <section className="flex flex-col gap-8">
        <div className="pt-2">
          <BubbleLeft>
            몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)
          </BubbleLeft>
        </div>

        <BubbleLeft>이사 종류를 선택해 주세요.</BubbleLeft>
        <div className="self-end mr-8 flex flex-col items-end gap-2">
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
        <div className="self-end mr-8 flex flex-col items-end gap-2">
          <BubbleRight>
            {date ? formatKoreanDate(date) : "날짜 미선택"}
          </BubbleRight>
          <button
            type="button"
            onClick={handleEditDate}
            className="text-[12px] text-[#8A8A8A] underline underline-offset-2"
          >
            수정하기
          </button>
        </div>

        <BubbleLeft>이사 지역을 선택해주세요.</BubbleLeft>

        {/* 입력 카드 */}
        <div className="self-end mr-8 w-[544px] rounded-[24px] bg-white p-[40px] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-[12px] font-semibold text-[#111]">
                출발지
              </div>
              <button
                type="button"
                onClick={openFrom}
                className="h-[48px] w-full rounded-xl border border-[#2E7BFF] px-4 text-left text-[14px] text-[#2E7BFF]"
              >
                {from ? `${from.address}` : "출발지 선택하기"}
              </button>
              {from && (
                <div className="mt-2 text-[12px] text-[#666]">
                  우편번호 {from.zonecode}
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold text-[#111]">
                도착지
              </div>
              <button
                type="button"
                onClick={openTo}
                className="h-[48px] w-full rounded-xl border border-[#2E7BFF] px-4 text-left text-[14px] text-[#2E7BFF]"
              >
                {to ? `${to.address}` : "도착지 선택하기"}
              </button>
              {to && (
                <div className="mt-2 text-[12px] text-[#666]">
                  우편번호 {to.zonecode}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={!canNext}
            onClick={handleConfirm}
            className={[
              "mt-8 h-[56px] w-full rounded-2xl font-bold",
              canNext
                ? "bg-[#2E7BFF] text-white"
                : "bg-[#E6E6E6] text-[#B9B9B9]",
            ].join(" ")}
          >
            선택완료
          </button>
        </div>
      </section>

      {/* ✅ 주소 검색 모달 */}
      <AddressSearchModal
        open={modalOpen}
        title={target === "from" ? "출발지 검색" : "도착지 검색"}
        onClose={() => setModalOpen(false)}
        onSelect={(res) => {
          const payload = { zonecode: res.zonecode, address: res.address };
          if (target === "from") setFrom(payload);
          else setTo(payload);
        }}
      />
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
