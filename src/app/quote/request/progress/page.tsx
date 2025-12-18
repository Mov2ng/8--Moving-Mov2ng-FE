"use client";

import { useRouter } from "next/navigation";
import { useQuoteRequestStore } from "../store";

export default function QuoteRequestProgressPage() {
  const router = useRouter();

  const step = useQuoteRequestStore((s) => s.step);
  const movingType = useQuoteRequestStore((s) => s.movingType);
  const date = useQuoteRequestStore((s) => s.date);
  const address = useQuoteRequestStore((s) => s.address);

  return (
    <main className="mx-auto max-w-[720px] px-6 py-10">
      <h1 className="mb-6 text-[18px] font-semibold">진행 상태(임시)</h1>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-2 text-[14px]">
          <div>step: {step}</div>
          <div>movingType: {movingType ?? "-"}</div>
          <div>date: {date ? date.toISOString().slice(0, 10) : "-"}</div>
          <div>address: {address ?? "-"}</div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="h-11 flex-1 rounded-xl bg-[#111] text-white font-semibold"
            onClick={() => router.push("/quote/request/type")}
          >
            처음으로
          </button>
        </div>
      </section>
    </main>
  );
}
