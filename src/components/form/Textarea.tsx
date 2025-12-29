import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps {
  register: UseFormRegisterReturn;
  placeholder?: string;
  rows?: number;
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
  rows = 4
}: TextareaProps) {
  return <textarea {...register} placeholder={placeholder} rows={rows} />;
}
