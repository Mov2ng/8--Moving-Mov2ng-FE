"use client";

import { useSignup } from "@/hooks/useAuth";
import { SignupFormValues, signupSchema } from "@/libs/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "../../../components/form/FormField";
import { parseServerError } from "@/utils/parseServerError";
import RoleToggle from "../../../components/toggle/RoleToggle";

/**
 * 회원가입 폼 컴포넌트
 * - react-hook-form + zod로 클라이언트 유효성 검사
 * - 서버 에러(예: 이메일 중복)는 mutation.error에서 처리
 * - 모든 입력 필드에 주석으로 설명 포함
 */
export default function SignupForm() {
  // react-hook-form 세팅 (zod 검증)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // useSignup hook: 서버에 회원가입 요청 mutation
  const signupMutation = useSignup();

  // form 제출 핸들러
  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signupMutation.mutateAsync({
        role: values.role,
        name: values.name,
        email: values.email,
        phoneNum: values.phoneNum,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
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

      // 에러 메시지 표시
      alert(parsed.message || "회원가입 중 알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RoleToggle register={register("role")} error={errors.role} />
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
