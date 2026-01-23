"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps {
  variant?: "solid" | "outline";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  color?: string;          
  borderColor?: string;    
  backgroundColor?: string; 
  className?: string;
}

export default function Button({
  variant = "solid",
  text,
  onClick,
  disabled = false,
  width = "auto",
  className,
}: ButtonProps) {
  const baseClasses = "px-6 py-3 rounded-2xl pret-lg-semibold transition duration-200 ease-in-out flex items-center justify-center";
  
  const variantClasses = variant === "solid" 
    ? disabled 
      ? "bg-gray-100 text-gray-50 border-none cursor-not-allowed"
      : "bg-primary-blue-300 text-gray-50 border-none cursor-pointer"
    : disabled
      ? "text-gray-100 border-2 border-gray-100 cursor-not-allowed"
      : "text-primary-blue-300 border-2 border-primary-blue-300 cursor-pointer";

  return (
    <button
      style={{ width }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variantClasses, className)}
    >
      {text}
    </button>
  );
}
