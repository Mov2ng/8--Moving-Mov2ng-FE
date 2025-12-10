"use client";

import { useState } from "react";
import DateCalendar from "../../../components/calendar/DateCalendar";

export default function DateCalendarTestPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleConfirm = () => {
    alert(
      selectedDate
        ? `선택된 날짜: ${selectedDate.toLocaleDateString()}`
        : "날짜가 선택되지 않았습니다"
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-10 p-10">
      <h1 className="text-white text-2xl mb-4">📅 DateCalendar Test</h1>

      {/* sm 사이즈 */}
      <DateCalendar
        size="sm"
        value={selectedDate}
        onChange={setSelectedDate}
        onConfirm={handleConfirm}
      />

      {/* md 사이즈 */}
      <DateCalendar
        size="md"
        value={selectedDate}
        onChange={setSelectedDate}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
