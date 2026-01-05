export const SERVICE_ICON_MAP = {
  소형이사: "/icons/box.svg",
  가정이사: "/icons/home.svg",
  사무실이사: "/icons/office.svg",
} as const;

export const SERVICE_LABEL_SHORT_MAP = {
  소형이사: "소형",
  가정이사: "가정",
  사무실이사: "사무실",
} as const;

export const DEFAULT_SERVICE_ICON = "/icons/box.svg" as const;

export type ServiceTypeKey = keyof typeof SERVICE_ICON_MAP;

export const isServiceTypeKey = (value: string): value is ServiceTypeKey =>
  value in SERVICE_ICON_MAP;
