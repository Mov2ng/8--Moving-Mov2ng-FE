"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface ProfileChipsProps {
  chipList: { name: string; value: string; label: string }[];
  register: UseFormRegisterReturn;
  content?: string;
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
  content,
}: ProfileChipsProps) {
  return (
    <div>
      {content && <div className="text-sm text-gray-500 mb-6">{content}</div>}
      <div className="grid grid-cols-5 gap-2.5 justify-items-start">
        {chipList.map((chip) => (
          <div key={chip.value}>
            <input
              {...register}
              type="checkbox"
              value={chip.value}
              id={chip.value}
              className="peer absolute opacity-0 w-0 h-0"
            />
            <label
              htmlFor={chip.value}
              className="flex justify-center items-center rounded-full border border-gray-100 bg-background-100 cursor-pointer transition-all duration-200 shadow-[2px_2px_20px_0_rgba(245,245,245,0.1)] max-md:shadow-[4px_4px_10px_0_rgba(230,230,230,0.16)] peer-checked:border-primary-blue-300 peer-checked:bg-primary-blue-50 peer-checked:shadow-[2px_2px_20px_0_rgba(245,245,245,0.1)] peer-checked:max-md:shadow-[4px_4px_10px_0_rgba(230,230,230,0.16)] 
             px-5 py-2.5 max-md:px-3 max-md:py-1.5"
            >
              {chip.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
