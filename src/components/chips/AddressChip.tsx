"use client";

import styles from "./AddressChip.module.scss";

type size = "sm" | "md";

type AddressChipProps = {
  label: string;
  size?: size;
  onClick?: () => void;
};

export default function AddressChip({
  label,
  size = "sm",
  onClick,
}: AddressChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${styles[size]}`}
    >
      {label}
    </button>
  );
}
