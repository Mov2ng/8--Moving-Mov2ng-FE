import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import Textarea from "./Textarea";

// 지원하는 필드 타입만 명시적으로 제한
type FormFieldType = "text" | "password" | "textarea" | "file";

interface FormFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
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
  type = "text",
  placeholder,
  children,
}: FormFieldProps) {
  const renderInput = () => {
    // input 타입에 따라 다른 컴포넌트 렌더링
    switch (type) {
      case "password":
        return <PasswordInput register={register} placeholder={placeholder} />;
      case "textarea":
        return <Textarea register={register} placeholder={placeholder} />;
      case "text":
      default:
        return <TextInput register={register} placeholder={placeholder} />;
    }
  };

  return (
    <div>
      <label>{label}</label>
      {children || renderInput()}
      {error && <p className="text-red-600 text-xs">{error.message}</p>}
    </div>
  );
}
