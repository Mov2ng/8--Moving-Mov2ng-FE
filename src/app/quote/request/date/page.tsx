"use client";

import { useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker/DatePicker";
import { useQuoteRequestStore } from "../store";

export default function Page() {
  const router = useRouter();
  const { date, setDate } = useQuoteRequestStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">이사 날짜를 선택해 주세요.</h3>

      <DatePicker
        size="sm"
        value={date ?? null}
        onChange={(d: Date) => setDate(d)}
        onConfirm={() => router.push("/quote/request/address")}
      />
    </div>
  );
}
