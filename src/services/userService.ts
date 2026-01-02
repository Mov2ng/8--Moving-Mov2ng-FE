import { apiClient, refreshAccessToken } from "@/libs/apiClient";
import { ProfileFormValues } from "@/libs/validation/profileSchemas";

/**
 * 사용자 관련 API 엔드포인트 레이어 서비스 user API endpoint layer service
 * - signup: 회원가입
 * - login: 로그인
 * - refresh: 토큰 갱신
 * - me: 사용자 정보 조회
 * - getProfile: 프로필 조회
 * - postProfile: 프로필 등록
 * - putProfile: 프로필 수정
 * - logout: 로그아웃
 */
export const userService = {
  signup: (data: {
    role: string;
    name: string;
    email: string;
    phoneNum: string;
    password: string;
    passwordConfirm: string;
  }) => {
    return apiClient("/auth/signup", {
      method: "POST",
      body: data,
    });
  },
  login: (data: { email: string; password: string; role: string }) => {
    return apiClient("/auth/login", {
      method: "POST",
      body: data,
    });
  },
  refresh: async () => {
    // refreshAccessToken 재사용 (동시 요청 방지 및 토큰 저장 로직 포함)
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw {
        status: 401,
        message: "토큰 재발급 실패",
      };
    }
    // apiClient 반환 형태와 일치시키기 위해 { data: { accessToken } } 형태로 반환
    return { data: { accessToken } };
  },
  me: () => {
    return apiClient("/auth/me", {
      method: "GET",
    });
  },
  logout: () => {
    return apiClient("/auth/logout", {
      method: "POST",
    });
  },
  getProfile: () => {
    return apiClient("/user/profile", {
      method: "GET",
    });
  },
  postProfile: (data: ProfileFormValues) => {
    return apiClient("/user/profile", {
      method: "POST",
      body: data,
    });
  },
  putProfile: (data: ProfileFormValues) => {
    return apiClient("/user/profile", {
      method: "PUT",
      body: data,
    });
  },
};
