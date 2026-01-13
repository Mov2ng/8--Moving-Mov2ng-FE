import { apiClient } from "@/libs/apiClient";

// Presigned URL 요청 파라미터 타입
type GetPresignedUrlParams = {
  fileName: string;
  category?: "PROFILE" | "SAMPLE"; // TODO: 추후 SAMPLE 수정
  contentType?: string;
};

// Presigned URL 응답 타입 (백엔드 응답 구조에 맞춤)
type PresignedUrlResponse = {
  presignedUrl: string;
  fileKey: string;
};

// 조회용 Presigned URL 응답 타입
type ViewPresignedUrlResponse = {
  presignedUrl: string;
};

// 삭제용 Presigned URL 응답 타입
type DeletePresignedUrlResponse = {
  presignedUrl: string;
};

/**
 * 파일 관련 API 엔드포인트 레이어 서비스 file API endpoint layer service
 * - getPresignedUrl: 업로드용 presigned URL 요청
 * - getViewPresignedUrl: 조회용 presigned URL 요청
 * - getDeletePresignedUrl: 삭제용 presigned URL 요청
 * - uploadToS3: S3에 파일 업로드
 * - deleteFileFromS3: S3에서 파일 삭제
 */
export const fileService = {
  /**
   * 업로드용 Presigned URL 요청
   * @param fileName - 파일 이름 (필수)
   * @param category - 파일 카테고리 (선택, 기본값: "PROFILE")
   * @param contentType - 파일 타입 (선택, 기본값: "image/jpeg")
   * @returns Presigned URL과 fileKey
   */
  getPresignedUrl: async (
    params: GetPresignedUrlParams
  ): Promise<PresignedUrlResponse> => {
    // 구조분해 및 기본값 설정
    const {
      fileName,
      category = "PROFILE",
      contentType = "image/jpeg",
    } = params;

    // fileName 필수 검증
    if (!fileName || typeof fileName !== "string" || fileName.trim() === "") {
      throw new Error("파일명은 필수입니다.");
    }

    // category 타입 검증
    if (
      category !== undefined &&
      category !== "PROFILE" &&
      category !== "SAMPLE"
    ) {
      throw new Error("파일 카테고리는 PROFILE 또는 SAMPLE만 가능합니다.");
    }

    const response = await apiClient("/upload/presigned-url", {
      method: "POST",
      body: {
        fileName,
        category,
        contentType,
      },
      timeout: 5000, // 파일 업로드용 presigned URL 요청은 5초 타임아웃
    });

    // 백엔드 응답 구조에 맞춰 반환
    return {
      presignedUrl: response.data?.presignedUrl || response.presignedUrl,
      fileKey: response.data?.fileKey || response.fileKey,
    };
  },

  /**
   * 조회용 Presigned URL 요청 (이미 업로드된 파일 조회)
   * @param fileKey - S3 파일 키 (필수)
   * @returns 조회용 Presigned URL
   */
  getViewPresignedUrl: async (
    fileKey: string
  ): Promise<ViewPresignedUrlResponse> => {
    // fileKey 필수 검증
    if (!fileKey || typeof fileKey !== "string" || fileKey.trim() === "") {
      throw new Error("파일 키는 필수입니다.");
    }

    const response = await apiClient("/upload/presigned-url", {
      method: "GET",
      query: {
        fileKey,
      },
    });

    // 백엔드 응답 구조에 맞춰 반환
    return {
      presignedUrl: response.data?.presignedUrl || response.presignedUrl,
    };
  },

  /**
   * S3에 파일 업로드 (PUT 요청으로 presigned URL 사용)
   * @param presignedUrl - Presigned URL
   * @param file - 파일
   * @param contentType - Content-Type (presigned URL 생성 시 사용한 값과 일치해야 함)
   */
  uploadToS3: async (
    presignedUrl: string,
    file: File,
    contentType: string
  ): Promise<void> => {
    // presigned URL은 외부 S3 URL이므로 apiClient가 아닌 fetch 직접 사용
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      if (!response.ok) {
        // 응답 본문 읽기 시도
        let errorMessage = `S3 파일 업로드 실패 (상태 코드: ${response.status})`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        } catch {
          // 응답 본문 읽기 실패 시 무시
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      // 네트워크 에러 등
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `S3 파일 업로드 중 네트워크 오류가 발생했습니다: ${String(error)}`
      );
    }
  },

  /**
   * 삭제용 Presigned URL 요청
   * @param fileKey - S3 파일 키 (필수)
   * @returns 삭제용 Presigned URL
   */
  getDeletePresignedUrl: async (
    fileKey: string
  ): Promise<DeletePresignedUrlResponse> => {
    // fileKey 필수 검증
    if (!fileKey || typeof fileKey !== "string" || fileKey.trim() === "") {
      throw new Error("파일 키는 필수입니다.");
    }

    const response = await apiClient("/upload/presigned-url", {
      method: "DELETE",
      query: {
        fileKey,
      },
    });

    // 백엔드 응답 구조에 맞춰 반환
    return {
      presignedUrl: response.data?.presignedUrl || response.presignedUrl,
    };
  },

  /**
   * S3에서 파일 삭제 (DELETE 요청으로 presigned URL 사용)
   * @param fileKey - 삭제할 파일의 S3 키
   */
  deleteFileFromS3: async (fileKey: string): Promise<void> => {
    // fileKey 필수 검증
    if (!fileKey || typeof fileKey !== "string" || fileKey.trim() === "") {
      throw new Error("파일 키는 필수입니다.");
    }

    try {
      // 1. 백엔드에서 삭제용 presigned URL 요청
      const response = await apiClient("/upload/presigned-url", {
        method: "DELETE",
        query: {
          fileKey,
        },
      });

      const presignedUrl = response.data?.presignedUrl || response.presignedUrl;

      if (!presignedUrl) {
        throw new Error("삭제용 presigned URL을 받지 못했습니다.");
      }

      // 2. presigned URL로 S3에 파일 삭제 요청
      const deleteResponse = await fetch(presignedUrl, {
        method: "DELETE",
      });

      if (!deleteResponse.ok) {
        // 응답 본문 읽기 시도
        let errorMessage = `S3 파일 삭제 실패 (상태 코드: ${deleteResponse.status})`;
        try {
          const errorText = await deleteResponse.text();
          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        } catch {
          // 응답 본문 읽기 실패 시 무시
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      // 삭제 실패 시 에러 로깅 (프로필 등록 실패 시 롤백이므로 에러를 throw하지 않음)
      console.error("파일 삭제 실패:", error);
      // 삭제 실패는 조용히 처리 (이미 프로필 등록이 실패한 상태이므로)
    }
  },
};
