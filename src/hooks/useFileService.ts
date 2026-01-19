"use client";

import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { fileService } from "@/services/fileService";

/**
 * 조회용 Presigned URL 가져오기 (이미지 표시용)
 * @param fileKey - S3 파일 키
 * @returns presignedUrl
 */
export function useGetViewPresignedUrl(fileKey: string | null | undefined) {
  return useApiQuery({
    queryKey: ["viewPresignedUrl", fileKey],
    queryFn: async () => {
      if (!fileKey) return null;
      const { presignedUrl } = await fileService.getViewPresignedUrl(fileKey);
      return presignedUrl;
    },
    enabled: !!fileKey, // fileKey가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
}

/**
 * 업로드용 Presigned URL 가져오기
 * @returns mutation 함수
 */
export function useGetPresignedUrl() {
  return useApiMutation({
    mutationKey: ["presignedUrl"],
    mutationFn: fileService.getPresignedUrl,
  });
}

/**
 * S3에 파일 업로드
 * @returns mutation 함수
 */
export function useUploadToS3() {
  return useApiMutation({
    mutationKey: ["uploadToS3"],
    mutationFn: ({
      presignedUrl,
      file,
      contentType,
    }: {
      presignedUrl: string;
      file: File;
      contentType: string;
    }) => fileService.uploadToS3(presignedUrl, file, contentType),
  });
}

/**
 * S3에서 파일 삭제
 * @returns mutation 함수
 */
export function useDeleteFileFromS3() {
  return useApiMutation({
    mutationKey: ["deleteFileFromS3"],
    mutationFn: (fileKey: string) => fileService.deleteFileFromS3(fileKey),
  });
}
