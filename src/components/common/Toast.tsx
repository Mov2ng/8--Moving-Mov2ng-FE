"use client";
import React from "react";
import Image from "next/image";

export default function Toast({
  content,
  info,
}: {
  content: string;
  info: boolean;
}) {
  return (
    <div
      className="flex items-center max-w-[955px] w-full border border-primary-blue-200 rounded-xl bg-primary-blue-100 
      py-[18px] px-[24px] gap-4
      max-sm:gap-2 max-sm:px-[24px] max-sm:py-[10px]"
    >
      {info && (
        <Image
          src="assets/icon/ic-info-blue.svg"
          alt="info"
          width={24}
          height={24}
          className="w-6 h-6 max-sm:w-4 max-sm:h-4"
        />
      )}
      <p className="text-lg max-sm:text-sm font-semibold text-primary-blue-300">
        {content}
      </p>
    </div>
  );
}
