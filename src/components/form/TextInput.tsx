import { FieldError, UseFormRegisterReturn } from "react-hook-form";

/**
 * TextInput: 일반 입력
 */
export default function TextInput({
  register,
  placeholder,
  error,
  touched = false,
}: {
  register: UseFormRegisterReturn;
  placeholder?: string;
  error?: FieldError;
  touched?: boolean;
}) {
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
    <input
      {...register}
      placeholder={placeholder}
      className={`w-full h-12 px-4 rounded-xl border transition-colors duration-200
        pret-14-regular text-black-400 placeholder:text-gray-400 focus:outline-none
        ${getBorderColor()}`}
    />
  );
}
