import React from "react";
import styles from "./CheckBox.module.scss";

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
  return (
    <button
      type="button"
      className={[
        styles.checkbox,
        styles[size],
        checked ? styles.checked : "",
      ].join(" ")}
      onClick={onClick}
    >
      <span className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </button>
  );
}
