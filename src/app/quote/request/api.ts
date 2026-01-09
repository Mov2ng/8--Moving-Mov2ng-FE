// app/quote/request/api.ts
export type CreateEstimatePayload = {
  movingType: string; // API enum (e.g. "HOME")
  movingDate: string; // "YYYY-MM-DD"
  origin: string; // "서울 중구" (string per swagger example)
  destination: string; // "서울 종로구"
};

export async function createEstimate(payload: CreateEstimatePayload) {
  const res = await fetch("https://eight-moving-mov2ng-be.onrender.com", {
    method: "POST",
    credentials: "include", // 중요: 인증이 필요하면 포함
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw json || new Error("서버 오류");
  }

  return json;
}
