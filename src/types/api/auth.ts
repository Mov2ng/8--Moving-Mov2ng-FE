import { apiFetch } from "./client";

export interface Me {
  id: string;
  email: string;
  phoneNum: string;
  name: string;
  role: "USER" | "DRIVER";
  provider: "LOCAL" | "KAKAO" | "NAVER";
}

export async function getMe() {
  return apiFetch<{ success: boolean; data: Me }>("/auth/me");
}
