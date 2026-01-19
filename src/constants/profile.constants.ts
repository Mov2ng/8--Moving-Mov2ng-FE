/**
 * 프로필 관련 상수
 */

// 기본 아바타 이미지 목록
export const DEFAULT_AVATARS: string[] = [
  "/assets/image/avatartion-1.png",
  "/assets/image/avatartion-2.png",
  "/assets/image/avatartion-3.png",
  "/assets/image/avatartion-4.png",
  "/assets/image/avatartion-5.png",
];

// 서비스 카테고리 목록
export const SERVICE_CATEGORIES: {
  name: string;
  value: string;
  label: string;
}[] = [
  { name: "serviceCategories", value: "SMALL", label: "소형이사" },
  { name: "serviceCategories", value: "HOME", label: "가정이사" },
  { name: "serviceCategories", value: "OFFICE", label: "사무실이사" },
];

// 서비스 카테고리 이미지 URL 매핑
export const SERVICE_CATEGORY_IMAGES: Record<string, string> = {
  SMALL: "/assets/icon/ic-box.svg",
  HOME: "/assets/icon/ic-home-fill.svg",
  OFFICE: "/assets/icon/ic-office-fill.svg",
};

// 서비스 카테고리 전체 정보 (label + 이미지 URL)
export const SERVICE_CATEGORY_INFO: Record<
  string,
  { label: string; imgUrl: string }
> = {
  SMALL: {
    label: "소형이사",
    imgUrl: SERVICE_CATEGORY_IMAGES.SMALL,
  },
  HOME: {
    label: "가정이사",
    imgUrl: SERVICE_CATEGORY_IMAGES.HOME,
  },
  OFFICE: {
    label: "사무실이사",
    imgUrl: SERVICE_CATEGORY_IMAGES.OFFICE,
  },
};

// 지역 목록
export const REGIONS: {
  name: string;
  value: string;
  label: string;
}[] = [
  { name: "region", value: "SEOUL", label: "서울" },
  { name: "region", value: "GYEONGGI", label: "경기" },
  { name: "region", value: "INCHEON", label: "인천" },
  { name: "region", value: "GANGWON", label: "강원" },
  { name: "region", value: "CHUNGBUK", label: "충북" },
  { name: "region", value: "CHUNGNAM", label: "충남" },
  { name: "region", value: "SEJONG", label: "세종" },
  { name: "region", value: "DAEJEON", label: "대전" },
  { name: "region", value: "JEONBUK", label: "전북" },
  { name: "region", value: "JEONNAM", label: "전남" },
  { name: "region", value: "GWANGJU", label: "광주" },
  { name: "region", value: "GYEONGBUK", label: "경북" },
  { name: "region", value: "GYEONGNAM", label: "경남" },
  { name: "region", value: "DAEGU", label: "대구" },
  { name: "region", value: "ULSAN", label: "울산" },
  { name: "region", value: "BUSAN", label: "부산" },
  { name: "region", value: "JEJU", label: "제주" },
];

// 서비스 카테고리 value -> label 매핑 맵
// 예: { "SMALL": "소형이사", "HOME": "가정이사", "OFFICE": "사무실이사" }
const SERVICE_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.map((item) => [item.value, item.label])
);

// 지역 value -> label 매핑 맵
// 예: { "SEOUL": "서울", "BUSAN": "부산", "JEJU": "제주" }
const REGION_MAP: Record<string, string> = Object.fromEntries(
  REGIONS.map((item) => [item.value, item.label])
);

// 역방향 매핑 (label -> value) - UI에서 API로 전송할 때 사용
// 예: { "소형이사": "SMALL", "가정이사": "HOME", "사무실이사": "OFFICE" }
const SERVICE_CATEGORY_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.map((item) => [item.label, item.value])
);

// 예: { "서울": "SEOUL", "부산": "BUSAN", "제주": "JEJU" }
const REGION_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  REGIONS.map((item) => [item.label, item.value])
);

/**
 * 서비스 카테고리 value 값을 한국어 label로 변환
 * @param value 서비스 카테고리 value 값 (예: "SMALL", "HOME", "OFFICE")
 * @returns 한국어 label (예: "소형이사", "가정이사", "사무실이사") 또는 원본 값
 *
 * 사용 예시:
 * getServiceLabel("SMALL") → "소형이사"
 * getServiceLabel("HOME") → "가정이사"
 */
export function getServiceLabel(value: string): string {
  return SERVICE_CATEGORY_MAP[value] ?? value;
}

/**
 * 지역 value 값을 한국어 label로 변환
 * @param value 지역 value 값 (예: "SEOUL", "BUSAN", "JEJU")
 * @returns 한국어 label (예: "서울", "부산", "제주") 또는 원본 값
 *
 * 사용 예시:
 * getRegionLabel("BUSAN") → "부산"
 * getRegionLabel("JEJU") → "제주"
 */
export function getRegionLabel(value: string): string {
  return REGION_MAP[value] ?? value;
}

/**
 * 서비스 카테고리 value 배열을 한국어 label 배열로 변환
 * @param values 서비스 카테고리 value 값 배열
 * @returns 한국어 label 배열
 *
 * 사용 예시:
 * getServiceLabels(["SMALL", "HOME"]) → ["소형이사", "가정이사"]
 */
export function getServiceLabels(values: string[]): string[] {
  return values.map(getServiceLabel);
}

/**
 * 지역 value 배열을 한국어 label 배열로 변환
 * @param values 지역 value 값 배열
 * @returns 한국어 label 배열
 *
 * 사용 예시:
 * getRegionLabels(["BUSAN", "JEJU"]) → ["부산", "제주"]
 */
export function getRegionLabels(values: string[]): string[] {
  return values.map(getRegionLabel);
}

/**
 * 서비스 카테고리 한국어 label을 value 값으로 변환 (역방향)
 * UI에서 선택한 값을 API로 보낼 때 사용
 * @param label 한국어 label (예: "소형이사", "가정이사", "사무실이사")
 * @returns 서비스 카테고리 value 값 (예: "SMALL", "HOME", "OFFICE") 또는 원본 값
 *
 * 사용 예시:
 * getServiceValue("소형이사") → "SMALL"
 * getServiceValue("가정이사") → "HOME"
 */
export function getServiceValue(label: string): string {
  return SERVICE_CATEGORY_REVERSE_MAP[label] ?? label;
}

/**
 * 지역 한국어 label을 value 값으로 변환 (역방향)
 * UI에서 선택한 값을 API로 보낼 때 사용
 * @param label 한국어 label (예: "서울", "부산", "제주")
 * @returns 지역 value 값 (예: "SEOUL", "BUSAN", "JEJU") 또는 원본 값
 *
 * 사용 예시:
 * getRegionValue("부산") → "BUSAN"
 * getRegionValue("제주") → "JEJU"
 */
export function getRegionValue(label: string): string {
  return REGION_REVERSE_MAP[label] ?? label;
}
