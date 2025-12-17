import z from "zod";

/**
 * 회원가입 스키마 (조건 설정)
 * - name: 최소 1자, 최대 50자
 * - email: 이메일 형식
 * - phoneNum: 숫자 문자열
 * - password: 최소 8자, 영문+숫자 권장
 */
export const signupSchema = z
  .object({
    role: z.enum(["USER", "DRIVER"], {
      message: "role은 'USER' 또는 'DRIVER'만 가능합니다",
    }),
    name: z.string().min(1, "이름을 입력해 주세요").max(50),
    email: z.email("유효한 이메일을 입력해 주세요"),
    phoneNum: z
      .string()
      .regex(/^[0-9]+$/, "숫자만 입력해 주세요")
      .transform((val) => (typeof val === "string" ? val : String(val))), // 숫자면 문자열로 변환
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(128)
      .regex(/[A-Za-z]/, { message: "비밀번호에 영문이 포함되어야 합니다." }) // 영문 1자 이상
      .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." }) // 숫자 1자 이상
      .regex(/[!@#$%^&*()_\-+=]/, {
        message: "비밀번호에 특수문자가 포함되어야 합니다.",
      }), // 특수문자 1자 이상
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다",
  });

// zod 스키마에서 ts 타입으로 변환
export type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * 로그인 스키마 (조건 설정)
 * - email, password
 */
export const loginSchema = z.object({
  role: z.enum(["USER", "DRIVER"], {
    message: "role은 'USER' 또는 'DRIVER'만 가능합니다",
  }),
  email: z.email("유효한 이메일을 입력해 주세요"),
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

// zod 스키마에서 ts 타입으로 변환
export type LoginFormValues = z.infer<typeof loginSchema>;
