import React from "react";
import Image from "next/image";

export default function Toast({ content, info }: { content: string, info: boolean }
) {
  return (
    <div className="flex items-center gap-4 max-w-[955px] w-full py-4.5 px-6 border border-primary-blue-200 rounded-xl bg-primary-blue-100"> 
      {info && <Image src='/icons/info.svg' alt="info" width={20} height={20} />}
      <p className="text-lg font-semibold text-primary-blue-300">{content}</p>
    </div>
  ); 
}
