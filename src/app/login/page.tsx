"use client";

import Image from "next/image";
import LoginForm from "./(components)/LoginForm";
import OAuth from "@/components/form/OAuth";
import Link from "next/link";
import { Suspense } from "react";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function LoginPage() {
  const { t } = useI18n();
  return (
    <div className="mt-14 flex flex-col items-center justify-center">
      <Image
        src="/assets/image/logo-text.png"
        alt="signup-title"
        width={106.698}
        height={55.138}
      />
      <Suspense fallback={<div>{t("loading")}</div>}>
        <LoginForm />
      </Suspense>
      <div className="mt-6 mb-18">
        {t("login_not_member")}{" "}
        <Link href="/signup" className="text-primary-blue-300 underline">
          {t("login_signup_link")}
        </Link>
      </div>
      {/* NOTE 잠정 중단: 이메일 기반 회원가입, 로그인, 프로필 조회, 수정 로직 모두 변경해야 함 */}
      {/* <OAuth /> */}
    </div>
  );
}
