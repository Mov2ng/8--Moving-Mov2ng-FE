"use client";

type Size = "sm" | "md";

type RegionChipProps = {
  label: string;
  selected?: boolean;
  size?: Size;
  onClick?: () => void;
};

export default function RegionChip({
  label,
  selected = false,
  size = "sm",
  onClick,
}: RegionChipProps) {
  const sizeCls =
    size === "sm"
      ? "py-1.5 px-3 text-sm leading-6"
      : "py-2.5 px-5 text-lg leading-[26px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `inline-flex items-center justify-center gap-2.5 rounded-full border
        bg-background-100 text-black-400 font-medium whitespace-nowrap
        border-line-100
        shadow-[4px_4px_10px_rgba(230,230,230,0.16)]
        transition-all duration-150 cursor-pointer
        ${sizeCls}
        ${selected ? `border-primary-blue-300 bg-primary-blue-50 text-primary-blue-300` : null}
      `}
    >
      {label}
    </button>
  );
}
