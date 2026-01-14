import z from "zod";
import { SERVICE_CATEGORIES, REGIONS } from "@/constants/profile.constants";

/**
 * 프로필 요청 검증 스키마
 * - USER와 DRIVER 공통 필드: profileImage, serviceCategories, region
 * - DRIVER 전용 필드: nickname, driverYears, driverIntro, driverContent
 */

// Category enum 값 추출
const categoryValues = SERVICE_CATEGORIES.map((item) => item.value) as [
  string,
  ...string[]
];

// RegionType enum 값 추출
const regionTypeValues = REGIONS.map((item) => item.value) as [
  string,
  ...string[]
];

// Category enum 값 검증
const categoryEnum = z.enum(categoryValues as [string, ...string[]], {
  message: "유효하지 않은 서비스 카테고리입니다. (SMALL, HOME, OFFICE 중 하나)",
});

// RegionType enum 값 검증
const regionTypeEnum = z.enum(regionTypeValues as [string, ...string[]], {
  message: "유효하지 않은 지역입니다.",
});

/**
 * 기본 프로필 스키마 (공통 필드) - 프로필 생성용
 * - 프로필 이미지 (필수)
 * - 서비스 카테고리 (필수)
 * - 지역 (필수)
 */
export const baseProfileCreateSchema = z.object({
  // 프로필 이미지: /upload/presigned-url에서 받은 fileKey 값을 profileImage로 전달
  profileImage: z.string().min(1, "프로필 이미지를 업로드해주세요"),
  serviceCategories: z
    .array(categoryEnum)
    .min(1, "서비스 카테고리는 최소 1개 이상이어야 합니다"),
  region: z.array(regionTypeEnum).min(1, "지역은 최소 1개 이상이어야 합니다"),
});

/**
 * 기본 프로필 스키마 (공통 필드) - 프로필 수정용
 * - 모든 필드 optional (변경된 필드만 전송)
 * - 폼 컴포넌트에서 변경된 필드만 submitData 객체에 포함시킴
 * - 변경되지 않은 필드는 submitData에 키 자체가 없음 → zod 스키마에 전달 시 undefined
 * - undefined가 아니면 변경된 필드로 간주하여 검증 수행
 */
export const baseProfileUpdateSchema = z
  .object({
    // 프로필 이미지: /upload/presigned-url에서 받은 fileKey 값을 profileImage로 전달
    profileImage: z.string().optional(),
    serviceCategories: z.array(categoryEnum).optional(),
    region: z.array(regionTypeEnum).optional(),
  })
  .refine(
    (data) => {
      // serviceCategories가 submitData에 포함된 경우(변경된 경우)에만 검증
      // 키가 없으면 undefined → 변경되지 않은 필드로 간주하여 검증 통과
      if (data.serviceCategories !== undefined) {
        return (
          Array.isArray(data.serviceCategories) &&
          data.serviceCategories.length > 0
        );
      }
      // undefined면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "서비스 카테고리는 최소 1개 이상이어야 합니다",
      path: ["serviceCategories"],
    }
  )
  .refine(
    (data) => {
      // region이 submitData에 포함된 경우(변경된 경우)에만 검증
      // 키가 없으면 undefined → 변경되지 않은 필드로 간주하여 검증 통과
      if (data.region !== undefined) {
        return Array.isArray(data.region) && data.region.length > 0;
      }
      // undefined면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "지역은 최소 1개 이상이어야 합니다",
      path: ["region"],
    }
  );

/**
 * DRIVER용 프로필 스키마 - 프로필 생성용
 * - 기본 프로필 필드 + DRIVER 전용 필드
 * - nickname 필수
 */
export const driverProfileCreateSchema = baseProfileCreateSchema.extend({
  nickname: z.string().min(1, "닉네임을 입력해 주세요").max(50),
  driverYears: z.number().min(0, "운전 경력은 0 이상이어야 합니다"),
  driverIntro: z
    .string()
    .min(1, "기사 소개를 입력해 주세요")
    .max(1000, "기사 소개는 최대 1000자 이하이어야 합니다"),
  driverContent: z
    .string()
    .min(1, "기사 상세 내용을 입력해 주세요")
    .max(1000, "기사 상세 내용은 최대 1000자 이하이어야 합니다"),
});

/**
 * USER용 프로필 스키마 - 프로필 생성용
 * - 기본 프로필 필드만 (DRIVER 전용 필드 없음)
 */
export const userProfileCreateSchema = baseProfileCreateSchema;

/**
 * DRIVER용 프로필 스키마 - 프로필 수정용
 * - 기본 프로필 필드 + DRIVER 전용 필드
 * - 모든 필드 optional (변경된 필드만 전송)
 * - 폼 컴포넌트에서 변경된 필드만 submitData 객체에 포함시킴
 * - 변경되지 않은 필드는 submitData에 키 자체가 없음 → zod 스키마에 전달 시 undefined
 * - undefined가 아니면 변경된 필드로 간주하여 검증 수행
 */
export const driverProfileSchema = baseProfileUpdateSchema
  .extend({
    nickname: z.string().optional(),
    driverYears: z.number().optional(),
    driverIntro: z.string().optional(),
    driverContent: z.string().optional(),
  })
  .refine(
    (data) => {
      // nickname이 submitData에 포함된 경우(변경된 경우)에만 검증
      // 키가 없으면 undefined → 변경되지 않은 필드로 간주하여 검증 통과
      if (data.nickname !== undefined) {
        return data.nickname.length >= 1 && data.nickname.length <= 50;
      }
      // undefined면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "닉네임을 입력해 주세요 (최대 50자)",
      path: ["nickname"],
    }
  )
  .refine(
    (data) => {
      // driverYears가 submitData에 포함된 경우(변경된 경우)에만 검증
      // 키가 없으면 undefined → 변경되지 않은 필드로 간주하여 검증 통과
      if (data.driverYears !== undefined) {
        return (
          typeof data.driverYears === "number" &&
          Number.isInteger(data.driverYears) &&
          data.driverYears >= 0
        );
      }
      // undefined면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "운전 경력은 0 이상의 정수여야 합니다",
      path: ["driverYears"],
    }
  )
  .refine(
    (data) => {
      // driverIntro가 submitData에 포함된 경우(변경된 경우)에만 검증
      // 키가 없으면 undefined → 변경되지 않은 필드로 간주하여 검증 통과
      if (data.driverIntro !== undefined) {
        return data.driverIntro.length >= 1 && data.driverIntro.length <= 1000;
      }
      // undefined면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "기사 소개를 입력해 주세요 (최대 1000자)",
      path: ["driverIntro"],
    }
  )
  .refine(
    (data) => {
      // driverContent가 submitData에 포함된 경우(변경된 경우)에만 검증
      // 키가 없으면 undefined → 변경되지 않은 필드로 간주하여 검증 통과
      if (data.driverContent !== undefined) {
        return (
          data.driverContent.length >= 1 && data.driverContent.length <= 1000
        );
      }
      // undefined면 변경되지 않은 필드이므로 검증 통과
      return true;
    },
    {
      message: "기사 상세 내용을 입력해 주세요 (최대 1000자)",
      path: ["driverContent"],
    }
  );

/**
 * USER용 프로필 스키마 - 프로필 수정용
 * - 기본 프로필 필드만 (DRIVER 전용 필드 없음)
 */
export const userProfileSchema = baseProfileUpdateSchema;

// baseProfileSchema는 baseProfileUpdateSchema의 별칭 (하위 호환성 및 명확성을 위해)
export const baseProfileSchema = baseProfileUpdateSchema;

/**
 * 프로필 스키마 생성 함수 (프로필 생성용)
 * @param role - 사용자 role ("USER" | "DRIVER")
 * @returns 프로필 스키마
 */
export const profileCreateSchema = (role?: "USER" | "DRIVER") => {
  const isDriver = role === "DRIVER";
  return isDriver ? driverProfileCreateSchema : userProfileCreateSchema;
};

/**
 * 프로필 스키마 생성 함수 (프로필 수정용)
 * @param role - 사용자 role ("USER" | "DRIVER")
 * @returns 프로필 스키마
 */
export const profileSchema = (role?: "USER" | "DRIVER") => {
  const isDriver = role === "DRIVER";
  return isDriver ? driverProfileSchema : userProfileSchema;
};

// ProfileFormValues는 DRIVER 스키마를 기준으로 타입 추론 (기존 호환성 유지)
export type ProfileFormValues = z.infer<typeof driverProfileSchema>;

// baseProfileSchema 타입도 export (필요시 사용)
export type BaseProfileFormValues = z.infer<typeof baseProfileSchema>;
