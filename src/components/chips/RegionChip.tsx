"use client";

import styles from "./RegionChip.module.scss";

type RegionChipProps = {
  label: string;
  selected?: boolean;
  size?: "sm" | "md";
  onClick?: () => void;
};

export default function RegionChip({
  label,
  selected = false,
  size = "sm",
  onClick,
}: RegionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${styles[size]} ${
        selected ? styles.selected : ""
      }`}
    >
      {label}
    </button>
  );
}
