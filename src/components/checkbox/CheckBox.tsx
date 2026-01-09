"use client";

type Size = "sm" | "md";

type CheckBoxProps = {
  label: string;
  size?: Size;
  checked?: boolean;
  onClick?: () => void;
};

export default function CheckBox({
  label,
  size = "md",
  checked = false,
  onClick,
}: CheckBoxProps) {
  const sizeCls =
    size === "sm"
      ? "max-w-[280px] py-[14px] px-4 text-sm"
      : "max-w-[560px] py-6 px-8 text-base";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-2xl border text-left transition",
        "bg-white cursor-pointer",
        sizeCls,
        checked
          ? "border-[#1b92ff] bg-[#f5faff] shadow-[4px_4px_10px_rgba(195,217,242,0.2)]"
          : "border-gray-200 hover:border-[#1b92ff]",
      ].join(" ")}
    >
      {/* icon */}
      <span
        className={[
          "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          checked
            ? "border-[#1b92ff] bg-[#1b92ff]"
            : "border-gray-300 bg-white",
        ].join(" ")}
      >
        {checked && (
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            className="absolute"
          >
            <path
              d="M1 3L4 5L9 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      {/* label */}
      <span className="font-semibold leading-6 text-black">{label}</span>
    </button>
  );
}
