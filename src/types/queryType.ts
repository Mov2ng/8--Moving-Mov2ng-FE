export type QuerySelectType = {
  label: string;
  value: string;
}

// export const moverSortOption: QuerySelectType[] = [
//   {
//     label: "리뷰 많은순",
//     value: "review",
//   },
//   {
//     label: "평점 높은순",
//     value: "rating",
//   },
//   { label: "경력 높은순", value: "career" },
//   { label: "확정 높은순", value: "confirm" },
// ];

// export const regionTypeOption: QuerySelectType[] = [
//   { label: "지역", value: "" },
//   { label: "전체", value: "" },
//   { label: "서울", value: "SEOUL" },
//   { label: "경기", value: "GYEONGGI" },
//   { label: "인천", value: "INCHEON" },
//   { label: "강원", value: "GANGWON" },
//   { label: "충북", value: "CHUNGBUK" },
//   { label: "충남", value: "CHUNGNAM" },
//   { label: "세종", value: "SEJONG" },
//   { label: "대전", value: "DAEJEON" },
//   { label: "전북", value: "JEONBUK" },
//   { label: "전남", value: "JEONNAM" },
//   { label: "광주", value: "GWANGJU" },
//   { label: "경북", value: "GYEONGBUK" },
//   { label: "경남", value: "GYEONGNAM" },
//   { label: "대구", value: "DAEGU" },
//   { label: "울산", value: "ULSAN" },
//   { label: "부산", value: "BUSAN" },
//   { label: "제주", value: "JEJU" },
// ];

// export const serviceTypeOption: QuerySelectType[] = [
//   { label: "서비스", value: "" },
//   { label: "전체", value: "" },
//   { label: "소형이사", value: "SMALL" },
//   { label: "가정이사", value: "HOME" },
//   { label: "사무실이사", value: "OFFICE" },
// ];

// 일단은 hook 없이 사용하기 위해 추가 t:(key: any) 타입 나중에 확인하기
export const moverSortOption = (t: (key: any) => string): QuerySelectType[] => [
  { label: t("review_many"), value: "review" },
  { label: t("rating_high"), value: "rating" },
  { label: t("career_high"), value: "career" },
  { label: t("confirm_high"), value: "confirm" },
];

export const regionTypeOption = (t: (key: any) => string): QuerySelectType[] => [
  { label: t("region"), value: "" },
  { label: t("filter_all"), value: "" },
  { label: t("region_seoul"), value: "SEOUL" },
  { label: t("region_gyeonggi"), value: "GYEONGGI" },
  { label: t("region_incheon"), value: "INCHEON" },
  { label: t("region_gangwon"), value: "GANGWON" },
  { label: t("region_chungbuk"), value: "CHUNGBUK" },
  { label: t("region_chungnam"), value: "CHUNGNAM" },
  { label: t("region_sejong"), value: "SEJONG" },
  { label: t("region_daejeon"), value: "DAEJEON" },
  { label: t("region_jeonbuk"), value: "JEONBUK" },
  { label: t("region_jeonnam"), value: "JEONNAM" },
  { label: t("region_gwangju"), value: "GWANGJU" },
  { label: t("region_gyeongbuk"), value: "GYEONGBUK" },
  { label: t("region_gyeongnam"), value: "GYEONGNAM" },
  { label: t("region_daegu"), value: "DAEGU" },
  { label: t("region_ulsan"), value: "ULSAN" },
  { label: t("region_busan"), value: "BUSAN" },
  { label: t("region_jeju"), value: "JEJU" },
];

export const serviceTypeOption = (t: (key: any) => string): QuerySelectType[] => [
  { label: t("service"), value: "" },
  { label: t("filter_all"), value: "" },
  { label: t("service_small"), value: "SMALL" },
  { label: t("service_home"), value: "HOME" },
  { label: t("service_office"), value: "OFFICE" },
];