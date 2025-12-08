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
      className="flex items-center gap-2 max-w-[955px] w-full border border-primary-blue-200 rounded-xl bg-primary-blue-100 
      px-[24px] py-[10px]
      md:py-[18px] md:px-[24px] md:gap-4"
    >
      {info && (
        <Image
          src="/icons/info.svg"
          alt="info"
          width={16}
          height={16}
          className="w-4 h-4 md:w-6 md:h-6"
        />
      )}
      <p className="text-sm md:text-lg font-semibold text-primary-blue-300">{content}</p>
    </div>
  );
}
