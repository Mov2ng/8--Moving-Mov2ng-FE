import { useState } from "react";
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
    <input
      {...registerProps}
      type={type}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        registerOnBlur(e);
        setIsFocused(false);
      }}
      className={`w-full h-12 px-4 py-3 rounded-xl duration-200 text-black-400
          placeholder:text-gray-500 focus:outline-none border border-gray-200
        ${getBorderColor()} ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  );
}
