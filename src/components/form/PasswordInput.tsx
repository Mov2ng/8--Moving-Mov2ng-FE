"use client";

import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

/**
 * PasswordInput: 비밀번호 입력 + 보기/숨기기 토글 기능
 */
export default function PasswordInput({
  register,
  placeholder,
  error,
  touched = false,
}: {
  register: UseFormRegisterReturn; // register("password") 결과 타입
  placeholder?: string;
  error?: FieldError;
  touched?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  // touched가 true일 때만 검증 상태에 따라 색상 변경
  const getBorderColor = () => {
    if (!touched) {
      return "border-gray-200 focus:border-primary-blue-300";
    }
    if (error) {
      return "border-secondary-red-200 focus:border-secondary-red-200";
    }
    return "border-primary-blue-300 focus:border-primary-blue-300";
  };

  return (
    <div className="relative flex items-center">
      <input
        {...register} // 속성 spread해 RHF 연결
        placeholder={placeholder}
        type={visible ? "text" : "password"}
        className={`w-full h-12 px-4 pr-12 rounded-xl border transition-colors duration-200
          pret-14-regular text-black-400 placeholder:text-gray-400 focus:outline-none
          ${getBorderColor()}`}
      />
      <button
        type="button"
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-4 size-6 bg-center bg-no-repeat cursor-pointer"
        style={{
          backgroundImage: visible
            ? "url(/assets/icon/ic-visibility-off.svg)"
            : "url(/assets/icon/ic-visibility-on.svg)",
        }}
      />
    </div>
  );
}
