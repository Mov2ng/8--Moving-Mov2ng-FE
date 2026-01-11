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
// 기본 스키마 (모든 필드 포함, 타입 안전성을 위해)
const baseProfileSchema = z.object({
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
  // DRIVER 전용 필드들 (USER일 때는 optional로 허용하되 validation에서는 무시)
  nickname: z.string(),
  driverYears: z
    .any()
    .refine(
      (val) =>
        val === undefined ||
        (typeof val === "number" && Number.isInteger(val) && val >= 0),
      "올바른 경력을 입력해주세요"
    ),
  driverIntro: z.string(),
  driverContent: z.string(),
});

export const profileSchema = (role?: "USER" | "DRIVER") => {
  const isDriver = role === "DRIVER";

  if (isDriver) {
    // DRIVER: 모든 필드 검증, DRIVER 전용 필드는 필수/선택 사항으로 검증
    return baseProfileSchema.extend({
      nickname: z.string().min(1, "닉네임을 입력해 주세요").max(50),
      driverIntro: z.string().min(1, "한 줄 소개를 입력해 주세요"),
      driverContent: z.string().min(1, "상세 설명을 입력해 주세요"),
    });
  } else {
    // USER: DRIVER 전용 필드들은 optional이지만 값이 없어야 함
    // 각 필드에 refine을 적용하여 값이 있으면 에러 발생
    return baseProfileSchema
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

export type ProfileFormValues = z.infer<typeof baseProfileSchema>;
