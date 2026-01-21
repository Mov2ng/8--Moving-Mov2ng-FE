type DayKey = "day_sun" | "day_mon" | "day_tue" | "day_wed" | "day_thu" | "day_fri" | "day_sat";

type TranslateFunction = ((key: string) => string) | undefined;

const DAY_KEYS: readonly DayKey[] = ["day_sun", "day_mon", "day_tue", "day_wed", "day_thu", "day_fri", "day_sat"] as const;

const getDayName = (dayIndex: number, t?: TranslateFunction): string => {
  if (!t) {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[dayIndex] || "";
  }
  const dayKey = DAY_KEYS[dayIndex];
  if (!dayKey) return "";
  return t(dayKey) || "";
};

export const formatDate = (iso: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")}`;
};

export const formatDateTime = (iso: string, t?: TranslateFunction) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const dayName = getDayName(d.getDay(), t);
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")} (${dayName})`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
  return `${date} ${time}`;
};

export const formatDateLabel = (iso: string, t?: TranslateFunction) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const dayName = getDayName(d.getDay(), t);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")}(${dayName})`;
};
