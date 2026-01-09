import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "solid" | "outlined";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const LandingButton: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  size = "md",
  onClick,
  className = "",
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-pretendard transition-all duration-200 cursor-pointer";

  const sizeStyles = {
    sm: "px-4 py-4 pret-2lg-semibold rounded-[50px] min-w-[116px] max-md:w-full h-[44px] max-sm:h-[40px]",
    md: "px-4 py-4 pret-xl-semibold rounded-[50px] min-w-[340px] max-md:w-full h-[64px] max-md:h-[56px] max-sm:h-[52px] shadow-button",
  };

  const variantStyles = {
    solid:
      "bg-primary-blue-300 text-gray-50 hover:bg-primary-blue-200 active:bg-primary-blue-400",
    outlined:
      "bg-gray-50 text-primary-blue-300 border border-primary-blue-300 hover:bg-primary-blue-50 active:bg-primary-blue-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default LandingButton;
