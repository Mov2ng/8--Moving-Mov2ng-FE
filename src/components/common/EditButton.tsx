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
    "inline-flex items-center justify-center gap-2 h-[64px] max-md:h-[54px] px-4 py-4 max-md:px-4 max-md:py-4 rounded-2xl pret-xl-semibold max-md:pret-lg-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed max-md:flex-1";
  const solidClass = `${baseClass} border border-primary-blue-300 bg-primary-blue-300 text-white hover:bg-primary-blue-400 hover:border-primary-blue-400 hover:shadow-md`;
  const outlineClass = `${baseClass} border border-gray-200 bg-background-200 text-gray-300 hover:bg-gray-100 hover:border-gray-300`;

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
      {iconSrc && (
        <Image
          src={iconSrc}
          alt=""
          width={24}
          height={24}
          className="max-md:w-6 max-md:h-6"
        />
      )}
    </button>
  );
}
