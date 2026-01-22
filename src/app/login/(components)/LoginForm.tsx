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
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";

/**
 * 로그인 폼
 * - 성공 시 accessToken을 저장하거나 useLogin의 onSuccess가 처리하도록 위임
 * - 로딩/에러 처리 포함
 * - Rate limit(429) 에러 발생 시 일정 시간 동안 로그인 버튼 비활성화
 */
export default function LoginForm() {
  const { t } = useI18n();
  const { toastContent, showToast } = useToast();
  // URL에서 redirect 파라미터 읽기
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  // Rate limit 제한 시간 (15분 = 900초)
  const RATE_LIMIT_COOLDOWN_MS = 15 * 60 * 1000;

  // Rate limit 상태 관리
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null); // Rate limit 적용 종료 시간
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0); // Rate limit 남은 시간 (초)
  const submittingRef = useRef(false); // 요청 중복 방지 플래그

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
  
  // mutation의 실제 로딩 상태 사용 (isSubmitting보다 정확함)
  const isLoggingIn = loginMutation.isPending || isSubmitting;

  // Rate limit 카운트다운 타이머
  useEffect(() => {
    // Rate limit 적용 종료 시간이 없으면 카운트다운 초기화
    if (!rateLimitUntil) {
      setRemainingSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((rateLimitUntil - now) / 1000));
      setRemainingSeconds(remaining);

      // Rate limit 적용 종료 시간이 지났으면 카운트다운 초기화
      if (remaining <= 0) {
        setRateLimitUntil(null);
      }
    };

    // 즉시 업데이트
    updateCountdown();

    // 1초마다 업데이트
    const interval = setInterval(updateCountdown, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(interval);
  }, [rateLimitUntil]);

  // 로컬 스토리지에서 rate limit 상태 복원 (페이지 새로고침 시에도 유지)
  useEffect(() => {
    const stored = localStorage.getItem("loginRateLimitUntil");
    if (stored) {
      const timestamp = parseInt(stored, 10);
      if (timestamp > Date.now()) {
        setRateLimitUntil(timestamp);
      } else {
        localStorage.removeItem("loginRateLimitUntil");
      }
    }
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    // 요청 중복 방지: 이미 요청 중이면 즉시 차단
    if (submittingRef.current) {
      return;
    }

    // 요청 시작 전 플래그 설정
    submittingRef.current = true;

    // Rate limit 체크
    if (rateLimitUntil && rateLimitUntil > Date.now()) {
      const remaining = Math.ceil((rateLimitUntil - Date.now()) / 1000);
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      showToast(
        t("login_rate_limit_message")
          .replaceAll("{minutes}", String(minutes))
          .replaceAll("{seconds}", String(seconds))
      );
      submittingRef.current = false;
      return;
    }

    try {
      await loginMutation.mutateAsync(values);

      // 성공 시
      reset(); // form 초기화
      setRateLimitUntil(null); // rate limit 상태 초기화
      localStorage.removeItem("loginRateLimitUntil"); // rate limit 상태 저장 제거
    } catch (error) {
      // 에러 파싱
      const parsed = parseServerError(error);

      // 파싱 실패시 서버 에러
      if (!parsed) {
        showToast(t("login_error"));
        return; // finally에서 플래그 해제됨
      }

      // Rate limit(429) 에러 처리
      if (parsed.status === 429) {
        const cooldownUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
        setRateLimitUntil(cooldownUntil); // rate limit 적용 종료 시간 설정
        localStorage.setItem("loginRateLimitUntil", cooldownUntil.toString()); // rate limit 상태 저장
        showToast(parsed.message || t("login_rate_limit_message_15min"));
        return; // finally에서 플래그 해제
      } else {
        // 다른 에러는 기존대로 처리
        showToast(parsed.message || t("login_error_unknown"));
        return; // finally에서 플래그 해제
      }
    } finally {
      submittingRef.current = false; // 요청 완료 후 플래그 해제
    }
  };

  // 버튼 비활성화 조건: 폼 검증 실패, 제출 중, rate limit 적용 중
  const isButtonDisabled =
    !isValid ||
    isLoggingIn ||
    (rateLimitUntil !== null && rateLimitUntil > Date.now());

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
        disabled={isButtonDisabled}
        tabIndex={isButtonDisabled ? -1 : 0}
      >
        {rateLimitUntil && rateLimitUntil > Date.now()
          ? t("login_rate_limit_retry_after")
              .replaceAll("{minutes}", String(Math.floor(remainingSeconds / 60)))
              .replaceAll("{seconds}", String(remainingSeconds % 60))
          : isLoggingIn
          ? t("login_submitting")
          : t("login")}
      </button>
      <Toast content={toastContent} />
    </form>
  );
}
