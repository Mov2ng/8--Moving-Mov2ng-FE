"use client";

import { useSignup } from "@/hooks/useAuth";
import { SignupFormValues, signupSchema } from "@/libs/validation/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "../../../components/form/FormField";
import { parseServerError } from "@/utils/parseServerError";
import RoleToggle from "../../../components/toggle/RoleToggle";
import { useI18n } from "@/libs/i18n/I18nProvider";
import Image from "next/image";
import Link from "next/link";
import OAuth from "@/components/form/OAuth";

/**
 * 회원가입 폼 컴포넌트
 * - react-hook-form + zod로 클라이언트 유효성 검사
 * - 서버 에러(예: 이메일 중복)는 mutation.error에서 처리
 * - 모든 입력 필드에 주석으로 설명 포함
 */
export default function SignupForm() {
  const { t } = useI18n();

  // react-hook-form 세팅 (zod 검증)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isValid },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // 입력 중 실시간 검증
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
        alert(t("signup_error"));
        return;
      }

      // 에러 메시지 표시
      alert(parsed.message || t("signup_error_unknown"));
    }
  };

  return (
    <div className="mt-14 flex flex-col items-center justify-center">
      <Image
        src="/assets/image/logo-text.png"
        alt="signup-title"
        width={106.698}
        height={55.138}
        className="mb-18"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[640px] max-md:max-w-[327px] flex flex-col gap-6"
      >
        <RoleToggle register={register("role")} error={errors.role} />
        <FormField
          label={t("signup_name")}
          register={register("name")}
          placeholder={t("signup_name_placeholder")}
          error={errors.name}
          touched={!!touchedFields.name}
        />
        <FormField
          label={t("signup_email")}
          register={register("email")}
          placeholder={t("signup_email_placeholder")}
          error={errors.email}
          touched={!!touchedFields.email}
        />
        <FormField
          label={t("signup_phone")}
          register={register("phoneNum")}
          placeholder={t("signup_phone_placeholder")}
          error={errors.phoneNum}
          touched={!!touchedFields.phoneNum}
        />
        <FormField
          label={t("signup_password")}
          type="password"
          register={register("password")}
          placeholder={t("signup_password_placeholder")}
          error={errors.password}
          touched={!!touchedFields.password}
        />
        <FormField
          label={t("signup_password_confirm")}
          type="password"
          register={register("passwordConfirm")}
          placeholder={t("signup_password_confirm_placeholder")}
          error={errors.passwordConfirm}
          touched={!!touchedFields.passwordConfirm}
        />
        {/* TODO: 추후 Button 컴포넌트로 리팩토링 */}
        <button
          type="submit"
          className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? t("signup_submitting") : t("signup_submit")}
        </button>
      </form>
      <div className="mt-6 mb-18">
        {t("signup_already_member")}{" "}
        <Link href="/login" className="text-primary-blue-300 underline">
          {t("signup_login_link")}
        </Link>
      </div>
      <OAuth />
    </div>
  );
}
