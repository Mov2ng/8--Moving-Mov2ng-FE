import z from "zod";

/**
 * 기본정보 수정 스키마
 * - name: 이름 (변경 가능, optional)
 * - phoneNum: 전화번호 (변경 가능, optional)
 * - currentPassword: 현재 비밀번호 (비밀번호 변경 시 필수)
 * - newPassword: 새 비밀번호 (비밀번호 변경 시 필수)
 * - newPasswordConfirm: 새 비밀번호 확인 (비밀번호 변경 시 필수)
 */
export const basicInfoSchema = z
  .object({
    name: z.string().optional(),
    phoneNum: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    newPasswordConfirm: z.string().optional(),
  })
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
      // name이 submitData에 포함되고 빈 문자열이 아닌 경우(변경된 경우)에만 검증
      // undefined이거나 빈 문자열이면 변경되지 않은 필드로 간주하여 검증 통과
      if (data.name !== undefined && data.name !== "") {
        return data.name.length >= 1 && data.name.length <= 50;
      }
      // undefined이거나 빈 문자열이면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "이름을 입력해 주세요 (최대 50자)",
      path: ["name"],
    }
  )
  .refine(
    (data) => {
      // phoneNum이 submitData에 포함되고 빈 문자열이 아닌 경우(변경된 경우)에만 검증
      // undefined이거나 빈 문자열이면 변경되지 않은 필드로 간주하여 검증 통과
      if (data.phoneNum !== undefined && data.phoneNum !== "") {
        // 숫자만 입력 검증
        if (!/^[0-9]+$/.test(data.phoneNum)) {
          return false;
        }
        // 길이 검증
        return data.phoneNum.length >= 10 && data.phoneNum.length <= 11;
      }
      // undefined이거나 빈 문자열이면 변경되지 않은 필드로 간주하여 검증 통과
      return true;
    },
    {
      message: "전화번호는 10-11자리 숫자만 입력해 주세요",
      path: ["phoneNum"],
    }
  )
  .refine(
    (data) => {
      // newPassword가 submitData에 포함되고 빈 문자열이 아닌 경우(변경된 경우)에만 검증
      // undefined이거나 빈 문자열이면 변경되지 않은 필드로 간주하여 검증 통과
      if (data.newPassword !== undefined && data.newPassword !== "") {
        // 길이 검증
        if (data.newPassword.length < 8 || data.newPassword.length > 128) {
          return false;
        }
        // 영문 포함 검증
        if (!/[A-Za-z]/.test(data.newPassword)) {
          return false;
        }
        // 숫자 포함 검증
        if (!/[0-9]/.test(data.newPassword)) {
          return false;
        }
        // 특수문자 포함 검증
        if (!/[!@#$%^&*()_\-+=]/.test(data.newPassword)) {
          return false;
        }
        return true;
      }
      // undefined이거나 빈 문자열이면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message:
        "비밀번호는 최소 8자 이상이며 영문, 숫자, 특수문자를 포함해야 합니다",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // 비밀번호 변경을 시도하는 경우에만 검증 (빈 문자열이 아닌 경우)
      const hasNewPassword =
        data.newPassword !== undefined && data.newPassword !== "";
      const hasNewPasswordConfirm =
        data.newPasswordConfirm !== undefined &&
        data.newPasswordConfirm !== "";
      const hasCurrentPassword =
        data.currentPassword !== undefined && data.currentPassword !== "";

      if (hasNewPassword || hasNewPasswordConfirm) {
        return hasCurrentPassword && hasNewPassword && hasNewPasswordConfirm;
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
      // 새 비밀번호와 확인이 일치하는지 검증 (빈 문자열이 아닌 경우에만)
      const hasNewPassword =
        data.newPassword !== undefined && data.newPassword !== "";
      const hasNewPasswordConfirm =
        data.newPasswordConfirm !== undefined &&
        data.newPasswordConfirm !== "";

      if (hasNewPassword && hasNewPasswordConfirm) {
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
