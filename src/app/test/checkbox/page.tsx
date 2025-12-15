"use client";

import { useState } from "react";
import CheckBox from "../../../components/checkbox/CheckBox";

export default function Page() {
  const [value, setValue] = useState<"sm" | "md">("md");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 테스트용 컨테이너 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
          maxWidth: 600,
        }}
      >
        {/* sm */}
        <CheckBox
          size="sm"
          label="소형의사 (원룸, 투룸, 20평대 미만)"
          checked={value === "sm"}
          onClick={() => setValue("sm")}
        />

        {/* md */}
        <CheckBox
          size="md"
          label="소형의사 (원룸, 투룸, 20평대 미만)"
          checked={value === "md"}
          onClick={() => setValue("md")}
        />
      </div>
    </div>
  );
}
