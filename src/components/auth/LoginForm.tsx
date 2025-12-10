"use client";

import { useLogin } from "@/hooks/useAuth";
import { LoginFormValues, loginSchema } from "@/libs/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormField from "../form/FormField";
import { parseServerError } from "@/utils/parseServerError";

/**
 * 로그인 폼
 * - 성공 시 accessToken을 저장하거나 useLogin의 onSuccess가 처리하도록 위임
 * - 로딩/에러 처리 포함
 */
export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // useLogin hook: onSuccess에서 accessToken 저장 + me invalidate 처리
  const loginMutation = useLogin();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      // 에러 파싱
      const parsed = parseServerError(error);

      // 파싱 실패시 서버 에러
      if (!parsed) {
        alert("로그인 중 오류가 발생했습니다.");
        return;
      }

      // 필드 에러 (details.field가 있을 때)
      if (parsed.details && typeof parsed.details === "object") {
        const { field } = parsed.details;
        const { reason } = parsed.details;

        if (field && typeof field === "string") {
          setError(field as keyof LoginFormValues, {
            // TODO: 타입 단언 타입 가드로 바꾸기
            message: typeof reason === "string" ? reason : parsed.message,
          });
          return;
        }
      }

      // 로그인 실패 기본 에러
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
        label="이메일"
        register={register("email")}
        placeholder="이메일을 입력해주세요"
        error={errors.email}
      />
      <FormField
        label="비밀번호"
        type="password"
        register={register("password")}
        placeholder="비밀번호를 입력해주세요"
        error={errors.password}
      />
      <button type="submit">{isSubmitting ? "로그인 중..." : "로그인"}</button>
    </form>
  );
}
