// app/quote/request/progress/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuoteRequestStore, MOVING_TYPE_MAP } from "../store";
import { createEstimate } from "../api";

export default function QuoteRequestProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movingType = useQuoteRequestStore((s) => s.movingType);
  const date = useQuoteRequestStore((s) => s.date);
  const address = useQuoteRequestStore((s) => s.address);

const handleSubmit = async () => {
  if (!movingType || !date || !address) return;

  try {
    setLoading(true);
    setError(null);

    const { origin, destination } = address;

    const payload = {
      movingType: MOVING_TYPE_MAP[movingType],
      movingDate: date.toISOString().slice(0, 10),
      origin: origin.address,
      destination: destination.address,
    };

    const res = await createEstimate(payload);

    console.log("견적 생성 성공", res);
    router.push("/quote/complete");
  } catch (e: unknown) {
    if (e instanceof Error) {
      setError(e.message);
    } else {
      setError("견적 요청에 실패했어요.");
    }
  } finally {
    setLoading(false);
  }
};


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

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="mt-4 h-11 w-full rounded-xl bg-[#2E7BFF] text-white font-semibold disabled:opacity-50"
        >
          {loading ? "요청 중..." : "견적 요청하기"}
        </button>
      </section>
    </main>
  );
}
