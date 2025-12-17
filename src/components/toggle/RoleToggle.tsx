import { FieldError, UseFormRegisterReturn } from "react-hook-form";


export default function RoleToggle({ register, error }: { register: UseFormRegisterReturn, error?: FieldError }) {
  return (
    <div>
      <label>회원 유형</label>
      <label>
        <input {...register} type="radio" value="USER" name="role" />
        일반 사용자
      </label>
      <label>
        <input {...register} type="radio" value="DRIVER" name="role" />
        기사님
      </label>
      {error && <p className="text-red-600 text-xs">{error.message}</p>}
    </div>
  );
}
