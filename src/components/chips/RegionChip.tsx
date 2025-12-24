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
      className={[
        "inline-flex items-center justify-center gap-2.5 rounded-full border",
        "bg-[#fafafa] text-[#242945] font-medium whitespace-nowrap",
        "border-[#dedede]",
        "shadow-[4px_4px_10px_rgba(230,230,230,0.16)]",
        "transition-all duration-150 cursor-pointer",
        sizeCls,
        selected ? "border-[#1b92ff] bg-[#f5faff] text-[#1b92ff]" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
