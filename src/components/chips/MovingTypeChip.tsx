"use client";

import Image from "next/image";

type Size = "sm" | "md";
type Variant = "bl" | "rd" | "gr";

type MovingTypeChipProps = {
  label: string;
  iconSrc: string;
  size?: Size; // sm | md
  variant?: Variant; // blue | red | gray
  onClick?: () => void;
};

export default function MovingTypeChip({
  label,
  iconSrc,
  size = "sm",
  variant = "bl",
  onClick,
}: MovingTypeChipProps) {
  const iconSize = size === "sm" ? 20 : 24;

  const baseCls =
    "inline-flex items-center justify-center rounded cursor-pointer whitespace-nowrap font-semibold border-none shadow-[4px_4px_8px_rgba(217,217,217,0.1)]";

  const sizeCls =
    size === "sm"
      ? "gap-0.5 text-[13px] leading-[22px] py-[2px] pr-[6px] pb-[2px] pl-[2px] max-md:px-[2px] max-md:py-[2px]"
      : "gap-1 text-base leading-none py-1 pr-[5px] pb-1 pl-[3px] max-md:px-2 max-md:py-1 max-md:text-[13px]";

  const variantCls =
    variant === "bl"
      ? "bg-[#e9f4ff] text-[#1673ff]"
      : variant === "rd"
      ? "bg-[#ffe9ec] text-[#ff4f64]"
      : "bg-[#f2f3f8] text-[#242945]";

  // SCSS에서 gr만 padding/정렬을 따로 주고 있었는데,
  // baseCls/sizeCls에서 이미 정렬은 맞고,
  // padding은 디자인상 gr을 더 단순하게 쓰고 싶다면 아래처럼 오버라이드 가능.
  const grayOverrideCls = variant === "gr" ? "px-[6px] py-[2px]" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[baseCls, sizeCls, variantCls, grayOverrideCls].join(" ")}
    >
      {iconSrc && (
        <Image
          src={iconSrc}
          alt={label}
          width={iconSize}
          height={iconSize}
          className="block max-md:w-[16px] max-md:h-[16px]"
        />
      )}
      <span className="block">{label}</span>
    </button>
  );
}
