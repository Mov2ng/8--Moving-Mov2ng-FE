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
