"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface ProfileChipsProps {
  chipList: { name: string; value: string; label: string }[];
  register: UseFormRegisterReturn;
}

/**
 * 프로필 칩 목록 컴포넌트
 * @param chipList - 프로필 칩 목록
 * @param register - React Hook Form register 함수 (배열 필드용)
 * @returns 프로필 칩 목록 컴포넌트
 */
export default function ProfileChips({
  chipList,
  register,
}: ProfileChipsProps) {
  return (
    <>
      {chipList.map((chip) => (
        <div key={chip.value}>
          <input
            {...register}
            type="checkbox"
            value={chip.value}
            id={chip.value}
          />
          <label htmlFor={chip.value}>{chip.label}</label>
        </div>
      ))}
    </>
  );
}
