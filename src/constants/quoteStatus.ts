export const quoteStatusChip = {
  waiting: {
    label: "견적 대기",
    className: "bg-background-300 text-black-300",
  },
  confirmed: {
    label: "확정 견적",
    className: "bg-background-300 text-black-400",
  },
  rejected: {
    label: "견적 거절",
    className: "bg-secondary-red-100 text-secondary-red-200",
  },
} as const;
