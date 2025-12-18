"use client";

import { useCallback } from "react";
import ReactDatePicker, {
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import { ko } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

registerLocale("ko", ko);

type Size = "sm" | "md";

export type DatePickerProps = {
  size?: Size;
  value: Date | null;
  onChange: (date: Date) => void;
  onConfirm?: () => void;
};

function formatMonthLabel(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}. ${month}`;
}

export default function DatePicker({
  size = "sm",
  value,
  onChange,
  onConfirm,
}: DatePickerProps) {
  const handleChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      onChange(date);
    },
    [onChange]
  );

  const hasValue = Boolean(value);

  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-6",
        "rounded-2xl bg-white py-6",
        "shadow-[2px_2px_10px_rgba(224,224,224,0.2)]",
        size === "sm" ? "datepicker-sm w-[320px]" : "datepicker-md w-[640px]",
      ].join(" ")}
    >
      <ReactDatePicker
        inline
        locale="ko"
        selected={value}
        onChange={handleChange}
        formatWeekDay={(name) => name.replace("요일", "").trim()}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
        }: ReactDatePickerCustomHeaderProps) => (
          <div className="flex w-full items-center justify-between px-6">
            <button
              type="button"
              onClick={decreaseMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400"
            >
              <img src="/icons/left.svg" alt="이전 달" />
            </button>

            <div className="font-semibold">{formatMonthLabel(date)}</div>

            <button
              type="button"
              onClick={increaseMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400"
            >
              <img src="/icons/right.svg" alt="다음 달" />
            </button>
          </div>
        )}
      />

      <button
        type="button"
        disabled={!hasValue || !onConfirm}
        onClick={onConfirm}
        className={[
          "h-16 w-[calc(100%-48px)] rounded-2xl font-semibold text-white",
          hasValue ? "bg-[#1b92ff]" : "cursor-not-allowed bg-gray-300",
        ].join(" ")}
      >
        선택완료
      </button>
    </div>
  );
}
