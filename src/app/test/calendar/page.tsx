"use client";

import { useState } from "react";
import DatePicker from "../../../components/DatePicker/DatePicker";

export default function CalendarTestPage() {
  const [smDate, setSmDate] = useState<Date | null>(null);
  const [mdDate, setMdDate] = useState<Date | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        background: "#373737",
        padding: "40px",
      }}
    >
      {/* Small Calendar */}
      <DatePicker
        size="sm"
        value={smDate}
        onChange={setSmDate}
        onConfirm={() => console.log("sm 선택완료:", smDate)}
      />

      {/* Medium Calendar */}
      <DatePicker
        size="md"
        value={mdDate}
        onChange={setMdDate}
        onConfirm={() => console.log("md 선택완료:", mdDate)}
      />
    </div>
  );
}
