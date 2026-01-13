import z from "zod";

/**
 * 기본정보 수정 스키마
 * - name: 이름 (변경 가능)
 * - phoneNum: 전화번호 (변경 가능)
 * - currentPassword: 현재 비밀번호 (비밀번호 변경 시 필수)
 * - newPassword: 새 비밀번호 (비밀번호 변경 시 필수)
 * - newPasswordConfirm: 새 비밀번호 확인 (비밀번호 변경 시 필수)
 */
export const basicInfoSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요").max(50),
    phoneNum: z
      .string()
      .regex(/^[0-9]+$/, "숫자만 입력해 주세요")
      .transform((val) => (typeof val === "string" ? val : String(val))),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(128)
      .regex(/[A-Za-z]/, { message: "비밀번호에 영문이 포함되어야 합니다." })
      .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." })
      .regex(/[!@#$%^&*()_\-+=]/, {
        message: "비밀번호에 특수문자가 포함되어야 합니다.",
      })
      .optional(),
    newPasswordConfirm: z.string().optional(),
  })
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
export type BasicInfoFormValues = z.infer<typeof basicInfoSchema> & {
  email?: string; // disabled 필드, API 요청에 포함되지 않음
};
