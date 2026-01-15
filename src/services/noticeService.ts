import { apiClient } from "@/libs/apiClient";
import type { NoticeListResponse, ReadAllResponse } from "@/types/api/notice";

/**
 * 알림 관련 API 엔드포인트 레이어 서비스
 * - getUserNotices: 일반 사용자 알림 조회
 * - getDriverNotices: 기사 알림 조회
 * - readNotice: 알림 읽음 처리
 * - readAllNotices: 알림 전체 읽음 처리
 */
export const noticeService = {
  getUserNotices: (params?: {
    page?: number;
    pageSize?: number;
    isDelete?: boolean;
  }) => {
    return apiClient("/notice/user", {
      method: "GET",
      query: params,
    }) as Promise<{ data: NoticeListResponse }>;
  },
  getDriverNotices: (params?: {
    page?: number;
    pageSize?: number;
    isDelete?: boolean;
  }) => {
    return apiClient("/notice/driver", {
      method: "GET",
      query: params,
    }) as Promise<{ data: NoticeListResponse }>;
  },
  readNotice: (noticeId: number) => {
    return apiClient(`/notice/read/${noticeId}`, {
      method: "POST",
    });
  },
  readAllNotices: (userId: string) => {
    return apiClient(`/notice/read/all/${userId}`, {
      method: "POST",
    }) as Promise<{ data: ReadAllResponse }>;
  },
};

