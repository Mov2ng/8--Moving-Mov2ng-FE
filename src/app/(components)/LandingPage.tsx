"use client";

import LandingButton from "./LandingButton";
import ServiceCard from "./ServiceCard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getToken } from "@/libs/auth/tokenStorage";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function LandingPage() {
  const router = useRouter();
  const { t } = useI18n();
  // 랜딩 페이지에서는 토큰이 없으면 API 호출을 건너뛰어 빠르게 렌더링
  const hasToken = typeof window !== "undefined" && getToken() !== null;
  const { isGuest } = useAuth(hasToken);

  // 토큰이 없으면 무조건 비회원으로 간주
  const showButtons = !hasToken || isGuest;

  return (
    <div className="min-h-screen bg-background-400">
      {/* Main Content */}
      <main className="pt-gnb">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center px-section-x md:px-6 sm:px-4 pb-40 md:pb-32 sm:pb-28">
          {/* Hero Title */}
          <div className="mt-20 md:mt-12 sm:mt-8 text-center">
            <h1 className="pret-3xl-semibold md:pret-2xl-semibold sm:pret-xl-semibold text-black-400 text-balance animate-fade-in-up">
              {t("landing_title_1")}
              <br />
              {t("landing_title_2")}
            </h1>
          </div>

          {/* Service Cards Grid - Desktop Layout (1920px 기준) */}
          <div
            className="grid grid-cols-3 grid-rows-2 gap-6 mt-12 max-md:mt-11 w-full h-[598px]
          max-md:grid-cols-1 max-md:grid-rows-3 max-md:gap-6 max-md:h-[792px]"
          >
            {/* Large Card (소형이사) - Left Side */}
            <div className="row-span-2 col-span-1 w-full h-full max-md:row-span-1 max-md:col-span-1 animate-fade-in-up animation-delay-200">
              <ServiceCard type="small" />
            </div>

            {/* Medium Card (가정이사) - Right Top */}
            <div className="row-span-1 col-span-2 w-full h-full max-md:col-span-1 max-md:row-span-1 animate-fade-in-up animation-delay-400">
              <ServiceCard type="home" />
            </div>

            {/* Medium Card (기업이사) - Right Bottom */}
            <div className="row-span-1 col-span-2 w-full h-full max-md:col-span-1 max-md:row-span-1 animate-fade-in-up animation-delay-600">
              <ServiceCard type="business" />
            </div>
          </div>

          {/* CTA Buttons */}
          {showButtons && (
            <div className="flex mt-12 max-md:flex-col items-center gap-4 max-md:w-full">
              <LandingButton
                variant="solid"
                size="md"
                onClick={() => router.push("/login")}
              >
                {t("landing_submit_login")}
              </LandingButton>
              <LandingButton
                variant="outlined"
                size="md"
                onClick={() => router.push("/signup")}
              >
                {t("landing_submit_signup")}
              </LandingButton>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
