import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps {
  register: UseFormRegisterReturn;
  placeholder?: string;
  rows?: number;
  error?: FieldError;
  touched?: boolean;
}

/**
 * Textarea: 텍스트 입력
 * @param register - react-hook-form register 함수
 * @param placeholder - 텍스트 입력 필드 플레이스홀더
 * @param rows - 텍스트 입력 필드 줄 수
 * @returns 텍스트 입력 필드
 */
export default function Textarea({
  register,
  placeholder,
  rows = 4,
  error,
  touched = false,
}: TextareaProps) {
  // 포커스 상태
  const [isFocused, setIsFocused] = useState(false);
  const { onBlur: registerOnBlur, ...registerProps } = register;

  const getBorderColor = () => {
    // 포커스 상태일 때
    if (isFocused) return "border border-primary-blue-300";
    // 터치되었고 에러가 있을 때
    if (touched && error) return "border border-secondary-red-200";
    // 터치되었고 에러가 없을 때
    if (touched && !error) return "border border-primary-blue-300";
    return "";
  };

  return (
    <textarea
      {...registerProps}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        registerOnBlur(e);
        setIsFocused(false);
      }}
      rows={rows}
      className={`w-full px-4 py-3 rounded-xl transition-colors duration-200
         text-black-400 placeholder:text-gray-500 resize-none focus:outline-none  bg-background-200
        ${getBorderColor()}`}
    />
  );
}
