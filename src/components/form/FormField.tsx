import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";

/**
 * FormField: label + input + error 메시지 공통 컴포넌트
 *
 * props:
 * - label: UI에 표시할 레이블
 * - register: RHF register()의 return 값
 * - error: FieldError 객체
 * - type: input 타입
 * - placeholder: placeholder 텍스트
 */
export default function FormField({
  label,
  register,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError; // 필드 검증 에러용
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label>{label}</label>
      {type === "password" ? (
        <PasswordInput
          register={register}
          placeholder={placeholder}
        ></PasswordInput>
      ) : (
        <TextInput register={register} placeholder={placeholder}></TextInput>
      )}
      {error && <p className="text-red-600 text-xs">{error.message}</p>}
    </div>
  );
}
