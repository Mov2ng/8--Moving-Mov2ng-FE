"use client";

import { useSignup } from "@/hooks/useAuth";
import { SignupFormValues, signupSchema } from "@/libs/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormField from "../form/FormField";
import { parseServerError } from "@/utils/parseServerError";

/**
 * 회원가입 폼 컴포넌트
 *
 * - react-hook-form + zod로 클라이언트 유효성 검사
 * - 서버 에러(예: 이메일 중복)는 mutation.error에서 처리
 * - 모든 입력 필드에 주석으로 설명 포함
 * throw {
  name: "ValidationError",      // ▷ 어떤 종류의 에러인지 식별
  code: "EMAIL_REQUIRED",       // ▷ 비즈니스 로직에서 식별하기 위한 고유 코드
  status: 400,                  // ▷ 클라이언트에게 내려갈 HTTP 상태 코드
  details: {                    // ▷ 어떤 필드에서 문제가 났는지 등 추가 정보
    field: "email",
    reason: "이메일이 비어 있습니다"
  }
};
 */
export default function SignupForm() {
  const router = useRouter();

  // react-hook-form 세팅 (zod 검증)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNum: "",
      password: "", // ANCHOR: 여긴 왜 string
      passwordConfirm: "",
    },
  });

  // useSignup hook: 서버에 회원가입 요청 mutation
  const signupMutation = useSignup();

  // form 제출 핸들러
  const onSubmit = async (values: SignupFormValues) => {
    try {
      // mutation으로 회원가입 요청
      // userService.signup 내부에서 apiClient가 body를 json.stringify
      await signupMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phoneNum: values.phoneNum,
        password: values.password,
      });

      // 성공 시 form reset + 성공 UI 처리
      reset();
    } catch (error) {
      // 에러 파싱
      const parsed = parseServerError(error);

      // 파싱 실패시 서버 에러
      if (!parsed) {
        alert("회원가입 중 오류가 발생했습니다.");
        return;
      }

      // 필드 에러 (details.field가 있을 때)
      if (parsed.details && typeof parsed.details === "object") {
        const { field } = parsed.details;
        const { reason } = parsed.details;

        if (field && typeof field === "string") {
          setError(field as keyof SignupFormValues, { // TODO: 타입 단언 타입 가드로 바꾸기
            message: typeof reason === "string" ? reason : parsed.message,
          });
          return;
        }
      }

      // 회원가입 실패 기본 에러
      if (parsed.message) {
        alert(parsed.message);
        return;
      }

      // 알 수 없는 오류 처리
      alert("회원가입 중 알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="이름"
        register={register("name")}
        placeholder="이름을 입력해주세요"
        error={errors.name}
      />
      <FormField
        label="이메일"
        register={register("email")}
        placeholder="이메일을 입력해주세요"
        error={errors.email}
      />
      <FormField
        label="전화번호"
        register={register("phoneNum")}
        placeholder="전화번호를 입력해주세요"
        error={errors.phoneNum}
      />
      <FormField
        label="비밀번호"
        type="password"
        register={register("password")}
        placeholder="비밀번호를 입력해주세요"
        error={errors.password}
      />
      <FormField
        label="비밀번호 확인"
        type="password"
        register={register("passwordConfirm")}
        placeholder="비밀번호를 다시 한 번 입력해주세요"
        error={errors.passwordConfirm}
      />
      <button type="submit">
        {isSubmitting ? "가입 처리 중..." : "회원가입"}
      </button>
    </form>
  );
}
