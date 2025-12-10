"use client";

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * PasswordInput: 비밀번호 입력 + 보기/숨기기 토글 기능
 */
export default function PasswordInput({
  register,
  placeholder,
}: {
  register: UseFormRegisterReturn; // register("password") 결과 타입
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex item-center">
      <input
        {...register} // 속성 spread해 RHF 연결
        placeholder={placeholder}
        type={visible ? "text" : "password"}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className={
          "size-6 bg-center bg-no-repeat " + visible
            ? "bg-[url(/assets/icon/ic-visibiity-off.svg)]"
            : "bg-[url(/assets/icon/ic-visibiity-on.svg)]"
        }
      ></button>
    </div>
  );
}
