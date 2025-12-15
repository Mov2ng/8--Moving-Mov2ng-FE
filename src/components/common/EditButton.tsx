import Image from "next/image";
import { PropsWithChildren } from "react";

interface EditButtonProps {
  variant?: "solid" | "outline";
  label: string;
  iconSrc?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function EditButton({
  variant = "solid",
  label,
  iconSrc = "/assets/icon/ic-writing.svg",
  onClick,
  disabled,
  className = "",
  type = "button",
}: PropsWithChildren<EditButtonProps>) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 h-[64px] px-4 py-4 rounded-2xl text-[20px] leading-[24px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const solidClass = `${baseClass} border border-primary-blue-300 bg-primary-blue-300 text-white hover:bg-primary-blue-400 hover:border-primary-blue-400 hover:shadow-md`;
  const outlineClass = `${baseClass} border border-primary-blue-300 bg-transparent text-primary-blue-300 hover:bg-primary-blue-50`;

  const composedClass = `${
    variant === "solid" ? solidClass : outlineClass
  } ${className}`;

  return (
    <button
      type={type}
      className={composedClass}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{label}</span>
      {iconSrc && <Image src={iconSrc} alt="" width={20} height={20} />}
    </button>
  );
}
