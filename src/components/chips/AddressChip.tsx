"use client";

type Size = "sm" | "md";

type AddressChipProps = {
  label: string;
  size?: Size;
  onClick?: () => void;
};

export default function AddressChip({ label, size = "sm", onClick }: AddressChipProps) {
  const sizeCls =
    size === "sm"
      ? "inline-flex text-xs leading-5 py-[2px] px-[6px]"
      : "flex w-[54px] text-sm leading-none py-[2px] px-1";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "items-center justify-center gap-0.5 rounded-2xl bg-[#f5faff] text-[#1b92ff] font-semibold",
        size === "sm" ? "inline-flex" : "flex",
        sizeCls,
      ].join(" ")}
    >
      {label}
    </button>
  );
}