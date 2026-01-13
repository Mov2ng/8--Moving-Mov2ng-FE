// app/quote/request/progress/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useQuoteRequestStore, MOVING_TYPE_MAP } from "../store";
import { useCreateEstimate } from "../api";

export default function QuoteRequestProgressPage() {
  const router = useRouter();
  const {
    mutate: createEstimateMutation,
    isPending,
    error,
  } = useCreateEstimate();

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const date = useQuoteRequestStore((s) => s.date);
  const address = useQuoteRequestStore((s) => s.address);

  const handleSubmit = () => {
    if (!movingType || !date || !address)
      return alert("모든 필수 정보를 입력해주세요.");

    const { origin, destination } = address;

    const payload = {
      movingType: MOVING_TYPE_MAP[movingType],
      movingDate: date.toISOString().slice(0, 10),
      origin: origin.address,
      destination: destination.address,
    };

    createEstimateMutation(payload, {
      onSuccess: (res) => {
        alert("견적 요청이 완료되었습니다.");
        router.push("/quote/complete");
      },
      onError: (e) => {
        console.error("견적 생성 실패", e);
      },
    });
  };

  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "견적 요청에 실패했어요. 다시 시도해주세요.";
      return (
    <main className="mx-auto w-full max-w-[1200px] px-4 md:px-10 py-8 md:py-12">
      <h1 className="mb-6 text-[18px] font-semibold">견적 요청 확인</h1>

      <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div>이사 종류: {movingType}</div>
        <div>이사 날짜: {date?.toISOString().slice(0, 10)}</div>
        <div>
          주소:{" "}
          {address
            ? `${address.origin.address} → ${address.destination.address}`
            : "주소 미입력"}
        </div>

        {error && <div className="text-red-500 text-sm">{errorMessage}</div>}

        <button
          disabled={isPending}
          onClick={handleSubmit}
          className="mt-4 h-11 w-full rounded-xl bg-[#2E7BFF] text-white font-semibold disabled:opacity-50"
        >
          {isPending ? "요청 중..." : "견적 요청하기"}
        </button>
      </section>
    </main>
  );
}