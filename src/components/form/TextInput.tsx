import { UseFormRegisterReturn } from "react-hook-form";

/**
 * TextInput: 일반 입력
 */
export default function TextInput({
  register,
  placeholder,
}: {
  register: UseFormRegisterReturn;
  placeholder?: string;
}) {
  return <input {...register} placeholder={placeholder} />;
}
