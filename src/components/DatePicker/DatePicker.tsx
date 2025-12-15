"use client";

import { useCallback } from "react";
import ReactDatePicker, {
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import { ko } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import styles from "./DatePicker.module.scss";

type Size = "sm" | "md";

export type DatePickerProps = {
  size?: Size; // sm / md
  value: Date | null; // 선택된 날짜
  onChange: (date: Date) => void; // 날짜 클릭 시
  onConfirm?: () => void; // 선택완료 버튼 클릭 시
};

registerLocale("ko", ko);

function formatMonthLabel(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
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

  const hasValue = !!value;
  const confirmClass = hasValue
    ? styles.confirmButton
    : styles.confirmButtonDisabled;

  return (
    <div className={`${styles.calendar} ${styles[size]}`}>
      <ReactDatePicker
        inline
        locale="ko"
        selected={value}
        onChange={handleChange}
        // 이 클래스 기준으로 내부 react-datepicker DOM에 :global 스타일 입힘
        calendarClassName={styles.inner}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
        }: ReactDatePickerCustomHeaderProps) => (
          <header className={styles.header}>
            <button
              type="button"
              className={styles.navButton}
              onClick={decreaseMonth}
              aria-label="이전 달"
            >
              <img src="/icons/left.svg" alt="이전 달" />
            </button>
            <div className={styles.monthLabel}>{formatMonthLabel(date)}</div>
            <button
              type="button"
              className={styles.navButton}
              onClick={increaseMonth}
              aria-label="다음 달"
            >
              <img src="/icons/right.svg" alt="다음 달" />
            </button>
          </header>
        )}
      />

      <button
        type="button"
        className={confirmClass}
        disabled={!hasValue || !onConfirm}
        onClick={onConfirm}
      >
        선택완료
      </button>
    </div>
  );
}
