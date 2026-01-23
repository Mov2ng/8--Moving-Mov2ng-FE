import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  register: UseFormRegisterReturn;
  placeholder?: string;
  error?: FieldError;
  touched?: boolean;
  type?: "text" | "number" | "email" | "tel";
  disabled?: boolean;
}
/**
 * TextInput: 일반 입력 (text, number, email, tel 지원)
 */
export default function TextInput({
  register,
  placeholder,
  error,
  touched = false,
  type = "text",
  disabled = false,
}: TextInputProps) {
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
    <input
      {...register}
      type={type}
      placeholder={placeholder}
      className={`w-full h-12 px-4 py-3 rounded-xl transition-colors duration-200 text-black-400
          placeholder:text-gray-500 focus:outline-none border
        ${getBorderColor()} ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  );
}
