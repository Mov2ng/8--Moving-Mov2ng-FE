"use client";

import { useLogin } from "@/hooks/useAuth";
import { LoginFormValues, loginSchema } from "@/libs/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "../../../components/form/FormField";
import { parseServerError } from "@/utils/parseServerError";
import RoleToggle from "../../../components/toggle/RoleToggle";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/libs/i18n/I18nProvider";

/**
 * 로그인 폼
 * - 성공 시 accessToken을 저장하거나 useLogin의 onSuccess가 처리하도록 위임
 * - 로딩/에러 처리 포함
 */
export default function LoginForm() {
  const { t } = useI18n();
  // URL에서 redirect 파라미터 읽기
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  // react-hook-form 세팅 (zod 검증)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isValid },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // 입력 중 실시간 검증
  });

  // useLogin hook: onSuccess에서 accessToken 저장 + me invalidate 처리
  const loginMutation = useLogin(redirectPath || undefined);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);

      // 성공 시 form reset + 성공 UI 처리
      reset();
    } catch (error) {
      // 에러 파싱
      const parsed = parseServerError(error);

      // 파싱 실패시 서버 에러
      if (!parsed) {
        alert(t("login_error"));
        return;
      }

      // 에러 메시지 표시
      alert(parsed.message || t("login_error_unknown"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[640px] max-md:max-w-[327px] flex flex-col gap-6"
    >
      <RoleToggle register={register("role")} error={errors.role} />
      <FormField
        label={t("login_email")}
        register={register("email")}
        placeholder={t("login_email_placeholder")}
        error={errors.email}
        touched={!!touchedFields.email}
      />
      <FormField
        label={t("login_password")}
        type="password"
        register={register("password")}
        placeholder={t("login_password_placeholder")}
        error={errors.password}
        touched={!!touchedFields.password}
      />
      <button
        type="submit"
        className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? t("login_submitting") : t("login")}
      </button>
    </form>
  );
}
