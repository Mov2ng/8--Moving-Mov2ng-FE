export type QuerySelectType = {
  label: string;
  value: string;
}

export const moverSortOption: QuerySelectType[] = [
  {
    label: "리뷰 많은순",
    value: "review",
  },
  {
    label: "평점 높은순",
    value: "rating",
  },
  { label: "경력 높은순", value: "career" },
  { label: "확정 높은순", value: "confirm" },
];

export const regionTypeOption: QuerySelectType[] = [
  { label: "지역", value: "" },
  { label: "전체", value: "" },
  { label: "서울", value: "SEOUL" },
  { label: "경기", value: "GYEONGGI" },
  { label: "인천", value: "INCHEON" },
  { label: "강원", value: "GANGWON" },
  { label: "충북", value: "CHUNGBUK" },
  { label: "충남", value: "CHUNGNAM" },
  { label: "세종", value: "SEJONG" },
  { label: "대전", value: "DAEJEON" },
  { label: "전북", value: "JEONBUK" },
  { label: "전남", value: "JEONNAM" },
  { label: "광주", value: "GWANGJU" },
  { label: "경북", value: "GYEONGBUK" },
  { label: "경남", value: "GYEONGNAM" },
  { label: "대구", value: "DAEGU" },
  { label: "울산", value: "ULSAN" },
  { label: "부산", value: "BUSAN" },
  { label: "제주", value: "JEJU" },
];

export const serviceTypeOption: QuerySelectType[] = [
  { label: "서비스", value: "" },
  { label: "전체", value: "" },
  { label: "소형이사", value: "SMALL" },
  { label: "가정이사", value: "HOME" },
  { label: "사무실이사", value: "OFFICE" },
];

