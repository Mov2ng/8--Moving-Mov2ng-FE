"use client";

import React from "react";
import type { MovingType } from "../store";

type Option = {
  value: MovingType;
  title: string;
  desc: string;
};

type Props = {
  options: Option[];
  value?: MovingType | null;
  onChange: (v: MovingType) => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

export default function MoveTypeSelect({
  options,
  value,
  onChange,
  onConfirm,
  confirmDisabled = false,
}: Props) {
  return (
    <div
      className={[
        "inline-flex flex-col items-start gap-6",
        "rounded-[32px] bg-white p-10",
        "shadow-[4px_4px_10px_rgba(224,224,224,0.8)]",
        "w-full max-w-[560px]",
      ].join(" ")}
    >
      <div className="flex w-full flex-col gap-4">
        {options.map((opt) => {
          const selected = value === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "w-full rounded-2xl border px-6 py-5 text-left transition",
                "flex items-center gap-4",
                selected
                  ? "border-[#2E7BFF] bg-[#F5FAFF]"
                  : "border-[#EAEAEA] bg-white hover:border-[#CFCFCF]",
              ].join(" ")}
            >
              {/* 라디오 */}
              <span
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-[#2E7BFF]" : "border-[#CFCFCF]",
                ].join(" ")}
                aria-hidden
              >
                {selected && (
                  <span className="h-3 w-3 rounded-full bg-[#2E7BFF]" />
                )}
              </span>

              <div className="text-[14px] leading-6">
                <span className="font-semibold text-[#111]">{opt.title}</span>
                <span className="text-[#666]"> {opt.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={[
          "h-[56px] w-full rounded-2xl text-[14px] font-semibold transition",
          confirmDisabled
            ? "cursor-not-allowed bg-[#D9D9D9] text-white"
            : "bg-[#1b92ff] text-white hover:bg-[#1673ff]",
        ].join(" ")}
      >
        선택완료
      </button>
    </div>
  );
}
