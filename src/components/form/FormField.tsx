import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import Textarea from "./Textarea";

// 지원하는 필드 타입만 명시적으로 제한
type FormFieldType = "text" | "password" | "textarea" | "file";

// 배열 필드용 에러 타입
export type FormFieldError = { message?: string | React.ReactNode } | undefined;

// 타입 가드 함수: type 속성이 있으면 FieldError
export function isFieldError(
  error: FieldError | FormFieldError | undefined
  // 반환 타입
): error is FieldError {
  // 실제 반환값 (boolean)
  return error !== undefined && "type" in error;
}

interface FormFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError | FormFieldError;
  touched?: boolean;
  type?: FormFieldType;
  placeholder?: string;
  children?: React.ReactNode;
}

/**
 * label + input + error 메시지 공통 컴포넌트
 * - label: UI에 표시할 레이블
 * - register: RHF register()의 return 값
 * - error: FieldError 객체
 * - type: input 타입
 * - placeholder: placeholder 텍스트
 * - children: 커스텀 컴포넌트 지원
 */
export default function FormField({
  label,
  register,
  error,
  touched = false,
  type = "text",
  placeholder,
  children,
}: FormFieldProps) {
  const renderInput = () => {
    // 타입 가드로 FieldError인지 확인 (text, textarea, password 타입일 때 FieldError 사용)
    const fieldError = isFieldError(error) ? error : undefined;

    // input 타입에 따라 다른 컴포넌트 렌더링
    switch (type) {
      case "password":
        return (
          <PasswordInput
            register={register}
            placeholder={placeholder}
            error={fieldError}
            touched={touched}
          />
        );
      case "textarea":
        return (
          <Textarea
            register={register}
            placeholder={placeholder}
            error={fieldError}
            touched={touched}
          />
        );
      case "text":
      default:
        return (
          <TextInput
            register={register}
            placeholder={placeholder}
            error={fieldError}
            touched={touched}
          />
        );
    }
  };

  return (
    <div className="w-full flex flex-col">
      <label className="text-xl text-black-400 font-medium mb-3">{label}</label>
      {children || renderInput()}
      {touched && error && (
        <p className="text-secondary-red-200 text-sm mt-1 mb-[-12px] text-right">
          {error?.message || ""}
        </p>
      )}
    </div>
  );
}
