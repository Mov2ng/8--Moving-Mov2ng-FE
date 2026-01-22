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

  const getBorderColor = () => {
    // 에러가 있을 때 (포커스 상태여도 빨간색)
    if (error) {
      return "border-secondary-red-200 focus:border-secondary-red-200";
    }
    // 터치되었고 에러가 없을 때
    if (touched && !error) {
      return "border-primary-blue-300 focus:border-primary-blue-300";
    }
    // 기본 상태
    return "border-gray-200 focus:border-primary-blue-300";
  };

  return (
    <div className="relative flex items-center">
      <input
        {...register}
        placeholder={placeholder}
        type={visible ? "text" : "password"}
        className={`w-full h-12 px-4 pr-12 rounded-xl transition-colors duration-200
          pret-14-regular text-black-400 placeholder:text-gray-400 focus:outline-none border
          ${getBorderColor()}`}
      />
      <button
        type="button"
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        onClick={() => setVisible((prev) => !prev)}
        tabIndex={-1}
        className="absolute right-4 size-6 bg-center bg-no-repeat cursor-pointer"
        style={{
          backgroundImage: visible
            ? "url(/assets/icon/ic-visibility-on.svg)"
            : "url(/assets/icon/ic-visibility-off.svg)",
        }}
      />
    </div>
  );
}
