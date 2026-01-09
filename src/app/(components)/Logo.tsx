import React from "react";

interface LogoProps {
  size?: "md" | "xl";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const dimensions = {
    md: { width: 116, height: 44 },
    xl: { width: 180, height: 68 },
  };

  const { width, height } = dimensions[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 116 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Moving Logo Icon */}
      <g>
        {/* Truck Icon */}
        <rect x="4" y="11" width="32" height="22" rx="4" fill="#1B92FF" />
        <rect x="28" y="16" width="14" height="17" rx="2" fill="#4DA9FF" />

        {/* Wheels */}
        <circle cx="12" cy="33" r="4" fill="#242945" />
        <circle cx="34" cy="33" r="4" fill="#242945" />

        {/* Boxes on truck */}
        <rect x="7" y="14" width="8" height="8" rx="1" fill="#E9F4FF" />
        <rect x="17" y="14" width="8" height="8" rx="1" fill="#F5FAFF" />
        <rect x="12" y="22" width="8" height="6" rx="1" fill="#E9F4FF" />
      </g>

      {/* Text: 무빙 */}
      <text
        x="52"
        y="28"
        fontFamily="Pretendard, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#1B92FF"
      >
        무빙
      </text>
    </svg>
  );
};

export default Logo;
