"use client";

import React from "react";

interface ButtonProps {
  variant?: "solid" | "outline";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  color?: string;          
  borderColor?: string;    
  backgroundColor?: string; 
}

export default function Button({
  variant = "solid",
  text,
  onClick,
  disabled = false,
  width = "auto",
}: ButtonProps) {

  // 색상 변수 선언
  const gray = "#DEDEDE";
  const blue = "#1B92FF";
  const white = "#FFFFFF";

  const baseStyle: React.CSSProperties = {
    padding: "16px",
    borderRadius: "16px",
    fontSize: "20px",
    width,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "0.2s ease",
  };

  const solidStyle: React.CSSProperties = {
    backgroundColor: disabled ? gray : blue,
    color: white,
    border: "none",
  };

  const outlineStyle: React.CSSProperties = {
    color: disabled ? gray : blue,
    border: `2px solid ${disabled ? gray : blue}`,
  };

  const style = variant === "solid" ? solidStyle : outlineStyle;

  return (
    <button style={{ ...baseStyle, ...style }} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
