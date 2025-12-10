"use client";

import Image from "next/image";
import styles from "./MovingTypeChip.module.scss";

type size = "sm" | "md";
type variant = "bl" | "rd" | "gr";

type MovingTypeChipProps = {
  label: string;
  iconSrc: string;
  size?: size; // sm | md
  variant?: variant; // blue | red | gray
  onClick?: () => void;
};

export default function MovingTypeChip({
  label,
  iconSrc,
  size = "sm",
  variant = "bl",
  onClick,
}: MovingTypeChipProps) {
  const iconSize = size === "sm" ? 20 : 24;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${styles[size]} ${styles[variant]}`}
    >
      {iconSrc && (
        <Image
          src={iconSrc}
          alt={label}
          width={iconSize}
          height={iconSize}
          className={styles.icon}
        />
      )}
      <span className={styles.label}>{label}</span>
    </button>
  );
}
