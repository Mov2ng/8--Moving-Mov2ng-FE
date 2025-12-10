"use client";

import { useMemo, useState } from "react";
import styles from "./DateCalendar.module.scss";

type Size = "sm" | "md";

export type DateCalendarProps = {
  size?: Size;
  value: Date | null; // 선택된 날짜
  onChange: (date: Date) => void; // 날짜 클릭했을 때
  onConfirm?: () => void; // 선택완료 버튼 클릭했을 때
};

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DateCalendar({
  size = "sm",
  value,
  onChange,
  onConfirm,
}: DateCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const today = useMemo(() => new Date(), []);

  const monthLabel = `${currentMonth.getFullYear()}. ${(
    currentMonth.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;

  const weeks = useMemo<DayCell[][]>(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const startWeekDay = start.getDay(); // 0(일) ~ 6(토)
    const daysInMonth = end.getDate();

    const cells: DayCell[] = [];

    // 앞쪽 빈 칸 (이전 달)
    for (let i = 0; i < startWeekDay; i += 1) {
      const d = new Date(start);
      d.setDate(d.getDate() - (startWeekDay - i));
      cells.push({ date: d, inCurrentMonth: false });
    }

    // 이번 달 날짜
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        date: new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day
        ),
        inCurrentMonth: true,
      });
    }

    // 끝쪽 빈 칸 (다음 달) – 7의 배수 맞추기
    const rest = cells.length % 7;
    if (rest !== 0) {
      const toAdd = 7 - rest;
      const last = cells[cells.length - 1].date;
      for (let i = 1; i <= toAdd; i += 1) {
        const d = new Date(last);
        d.setDate(d.getDate() + i);
        cells.push({ date: d, inCurrentMonth: false });
      }
    }

    // 7개씩 끊어서 주 단위로 만들기
    const result: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }

    return result;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className={`${styles.calendar} ${styles[size]}`}>
      {/* 상단: 월 이동 헤더 */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={handlePrevMonth}
          aria-label="이전 달"
        >
          &lt;
        </button>
        <div className={styles.monthLabel}>{monthLabel}</div>
        <button
          type="button"
          className={styles.navButton}
          onClick={handleNextMonth}
          aria-label="다음 달"
        >
          &gt;
        </button>
      </header>

      {/* 요일 */}
      <div className={styles.weekHeaderRow}>
        {WEEK_DAYS.map((day) => (
          <div key={day} className={styles.weekHeaderCell}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className={styles.weekBody}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.weekRow}>
            {week.map(({ date, inCurrentMonth }) => {
              const isToday = isSameDay(date, today);
              const isSelected = value ? isSameDay(date, value) : false;

              const classNames = [
                styles.dayButton,
                !inCurrentMonth && styles.outside,
                isToday && styles.today,
                isSelected && styles.selected,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={classNames}
                  onClick={() => onChange(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 하단 선택완료 버튼 */}
      <button
        type="button"
        className={
          value
            ? styles.confirmButton // 날짜 있음 → 활성
            : styles.confirmButtonDisabled // 날짜 없음 → 비활성
        }
        onClick={onConfirm}
        disabled={!value}
      >
        선택완료
      </button>
    </div>
  );
}
