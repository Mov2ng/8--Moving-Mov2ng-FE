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
    <textarea
      {...register}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 rounded-xl transition-colors duration-200
         text-black-400 placeholder:text-gray-500 resize-none focus:outline-none bg-background-200 border
        ${getBorderColor()}`}
    />
  );
}
