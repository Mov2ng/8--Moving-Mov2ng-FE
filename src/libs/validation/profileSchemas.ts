import z from "zod";

/**
 * 프로필 폼 검증 스키마
 * - profileImage: 프로필 이미지
 * - serviceCategories: 이용 서비스 / 제공 서비스
 * - region: 내가 사는 지역 / 서비스 가능 지역
 * - nickname: 닉네임
 * - driverYears: 운전 경력
 * - driverIntro: 기사 소개
 * - driverContent: 기사 상세 내용
 * @param role - 사용자 role ("USER" | "DRIVER")
 */
// 공통 스키마 (USER와 DRIVER 모두 필요한 필드)
const commonProfileSchema = z.object({
  profileImage: z.string(),
  serviceCategories: z
    .any()
    .refine(
      (val) => Array.isArray(val) && val.length > 0,
      "하나 이상의 서비스를 선택해주세요"
    )
    .pipe(z.array(z.string())),
  region: z
    .any()
    .refine(
      (val) => Array.isArray(val) && val.length > 0,
      "하나 이상의 지역을 선택해주세요"
    )
    .pipe(z.array(z.string())),
});

export const profileSchema = (role?: "USER" | "DRIVER") => {
  const isDriver = role === "DRIVER";

  if (isDriver) {
    // DRIVER: 모든 필드 검증, DRIVER 전용 필드는 필수/선택 사항으로 검증
    return commonProfileSchema.extend({
      nickname: z.string().min(1, "닉네임을 입력해 주세요").max(50),
      driverYears: z
        .any()
        .refine(
          (val) =>
            val === undefined ||
            (typeof val === "number" && Number.isInteger(val) && val >= 0),
          "올바른 경력을 입력해주세요"
        ),
      driverIntro: z.string().min(1, "한 줄 소개를 입력해 주세요"),
      driverContent: z.string().min(1, "상세 설명을 입력해 주세요"),
    });
  } else {
    // USER: DRIVER 전용 필드들은 optional이지만 값이 없어야 함
    return commonProfileSchema
      .extend({
        nickname: z.string().optional(),
        driverYears: z
          .any()
          .refine(
            (val) =>
              val === undefined ||
              (typeof val === "number" && Number.isInteger(val) && val >= 0),
            "올바른 경력을 입력해주세요"
          )
          .optional(),
        driverIntro: z.string().optional(),
        driverContent: z.string().optional(),
      })
      .refine((data) => !data.nickname, {
        message: "일반 회원은 닉네임을 사용할 수 없습니다",
        path: ["nickname"],
      })
      .refine((data) => data.driverYears === undefined, {
        message: "일반 회원은 운전 경력을 입력할 수 없습니다",
        path: ["driverYears"],
      })
      .refine((data) => !data.driverIntro, {
        message: "일반 회원은 기사 소개를 입력할 수 없습니다",
        path: ["driverIntro"],
      })
      .refine((data) => !data.driverContent, {
        message: "일반 회원은 기사 상세 내용을 입력할 수 없습니다",
        path: ["driverContent"],
      });
  }
};

// ProfileFormValues는 DRIVER 스키마를 기준으로 타입 추론 (기존 호환성 유지)
export type ProfileFormValues = z.infer<ReturnType<typeof profileSchema>>;
