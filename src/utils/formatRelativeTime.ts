/**
 * 상대적 시간 표시 함수
 * - 1분 미만: "방금 전"
 * - 1시간 미만: "X분 전"
 * - 24시간 미만: "X시간 전"
 * - 24시간 이상: "yy.mm.dd" 형식
 */
export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 1분 미만
  if (diffMin < 1) return "방금 전";
  
  // 1시간 미만
  if (diffMin < 60) return `${diffMin}분 전`;
  
  // 24시간 미만
  if (diffHour < 24) return `${diffHour}시간 전`;
  
  // 24시간 이상
  return `${diffDays}일 전`;
}