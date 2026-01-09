"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export default function RoleToggle({
  register,
  error,
}: {
  register: UseFormRegisterReturn;
  error?: FieldError;
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* 제목 라벨 */}
      <label className="text-black-400 text-xl font-medium mb-2">
        회원 유형
      </label>

      {/* 토글 컨테이너 */}
      <div className="relative flex w-full h-12 rounded-full bg-gray-100 overflow-hidden">
        {/* USER */}
        <input
          {...register}
          type="radio"
          value="USER"
          id="role-user"
          className="peer/user hidden"
          defaultChecked
        />
        <label
          htmlFor="role-user"
          className="z-10 flex-1 cursor-pointer flex items-center justify-center text-sm text-gray-700 peer-checked/user:text-white transition-colors duration-300"
        >
          일반 사용자
        </label>

        {/* DRIVER */}
        <input
          {...register}
          type="radio"
          value="DRIVER"
          id="role-driver"
          className="peer/driver hidden"
        />
        <label
          htmlFor="role-driver"
          className="z-10 flex-1 cursor-pointer flex items-center justify-center text-sm text-gray-500 peer-checked/driver:text-white transition-colors duration-300"
        >
          기사님
        </label>

        {/* 슬라이더 - 하나의 버튼이 좌우로 이동 */}
        <span
          className="absolute top-1 left-1 my-auto h-10 w-[calc(50%)]
                 rounded-full bg-primary-blue-300 shadow-md transition-transform duration-300
                 peer-checked/driver:translate-x-[calc(100%-0.5rem)]"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-secondary-red-200 pret-xs-regular">
          {error.message}
        </p>
      )}
    </div>
  );
}
