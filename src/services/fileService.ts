import { apiClient } from "@/libs/apiClient";

// Presigned URL 응답 타입
type PresignedUrlResponse = {
  url: string;
  [key: string]: unknown;
};

// S3 파일 URL 응답 타입
type S3UrlResponse = {
  url: string;
  [key: string]: unknown;
};

/**
 * 파일 관련 API 엔드포인트 레이어 서비스 file API endpoint layer service
 * - getPresignedUrl: presigned URL 요청
 * - uploadToS3: S3에 파일 업로드
 * - getS3Url: 업로드된 파일의 S3 URL 조회
 */
export const fileService = {
  getPresignedUrl: async (
    fileName: string,
    fileType: string
  ): Promise<PresignedUrlResponse> => {
    return apiClient("/files/presigned-url", {
      method: "POST",
      body: { fileName, fileType },
    });
  },

  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    // apiClient는 내부 API 전용, s3 presigned URL은 외부 API + JSON 응답X
    // → 확장 시 skipAuth, skipJsonParse 옵션 추가 필요 (복잡도 ↑)
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      // apiClient와 동일한 에러 형태로 throw
      throw {
        status: response.status,
        message: `S3 파일 업로드 실패: ${response.statusText}`,
        error: null,
      };
    }
  },

  getS3Url: async (fileName: string): Promise<S3UrlResponse> => {
    return apiClient(`/files/${fileName}`, {
      method: "GET",
    });
  },
};
