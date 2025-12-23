"use client";

import React from "react";
import clsx from "clsx";

type Variant = "bot" | "userSolid" | "userSoft";

type ChatBubbleProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  bot: "bg-white text-gray-900",
  userSolid: "bg-[#1b92ff] text-white",
  userSoft: "bg-[#E9F4FF] text-[#1673FF]",
};

export default function ChatBubble({
  children,
  variant = "bot",
  className,
}: ChatBubbleProps) {
  return (
    <div
      className={clsx(
        "inline-flex flex-col items-start justify-center",
        "px-5 py-3", // padding: 12px 20px
        "rounded-[24px] rounded-bl-none", // 24 24 24 0
        "shadow-[2px_2px_8px_rgba(224,224,224,0.8)]",
        "max-w-[580px]", // 스샷 오른쪽 max 폭
        variantClass[variant],
        className
      )}
    >
      <p className="text-sm font-medium leading-6 break-keep">{children}</p>
    </div>
  );
}
