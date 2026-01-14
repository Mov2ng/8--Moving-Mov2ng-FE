import z from "zod";
import { baseProfileSchema } from "./profileSchemas";
import { basicInfoSchema } from "./basicInfoSchemas";

/**
 * 일반 회원용 통합 스키마
 * - 기본 프로필 필드 + 기본정보 필드
 * - 프로필 수정과 기본정보 수정을 한 번에 처리할 때 사용
 */
export const userIntegrationSchema = baseProfileSchema
  .safeExtend(basicInfoSchema.shape)
  .refine(
    (data) => {
      // email 필드는 disabled 필드이므로 API 요청에 포함되면 안 됨
      return !("email" in data && data.email !== undefined);
    },
    {
      message: "이메일 필드는 수정할 수 없습니다",
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      // 비밀번호 변경을 시도하는 경우에만 검증
      if (data.newPassword || data.newPasswordConfirm) {
        return (
          data.currentPassword && data.newPassword && data.newPasswordConfirm
        );
      }
      return true;
    },
    {
      message: "비밀번호 변경 시 모든 비밀번호 필드를 입력해주세요",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // 새 비밀번호와 확인이 일치하는지 검증
      if (data.newPassword && data.newPasswordConfirm) {
        return data.newPassword === data.newPasswordConfirm;
      }
      return true;
    },
    {
      path: ["newPasswordConfirm"],
      message: "비밀번호가 일치하지 않습니다",
    }
  );

// 스키마에서 추론한 타입에 email 추가 (disabled 필드이지만 react-hook-form 타입을 위해 포함)
export type UserIntegrationFormValues = z.infer<
  typeof userIntegrationSchema
> & {
  email?: string; // disabled 필드, API 요청에 포함되지 않음
};
