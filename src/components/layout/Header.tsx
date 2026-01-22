"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import { useI18n } from "@/libs/i18n/I18nProvider";
import { getToken } from "@/libs/auth/tokenStorage";
import Button from "@/components/common/button";
import Notice from "@/components/Notice/Notice";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import MenuNav from "./components/MenuNav";
import MenuDrawer from "./components/MenuDrawer";
import LanguageDropdown from "./components/LanguageDropdown";
import ProfileDropdown from "./components/ProfileDropdown";

type MenuItem = {
  href: string;
  label: string;
};

export default function Header() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null); // null: 아직 확인 안 함, true/false: 확인 완료
  
  // 서버/클라이언트 상태 일치를 위해 항상 useAuth 호출 (토큰 없으면 쿼리 비활성화)
  const { me, isGuest, isLoading, isFetching, status, isUser, isDriver } = useAuth();
  
  // 클라이언트에서만 토큰 확인 (hydration 에러 방지)
  useEffect(() => {
    setHasToken(getToken() !== null);
  }, []);
  
  // 토큰 확인 전까지 로딩 처리하여 새로고침 시 비회원 헤더 노출 방지
  const isAuthLoading = hasToken === null || (hasToken && (isLoading || isFetching || status === 'pending'));

  const { t, locale, setLocale } = useI18n();

  // 역할별 메뉴 정의 (다국어 지원)
  const MENU_ITEMS: Record<string, MenuItem[]> = useMemo(
    () => ({
      GUEST: [
        { href: "/movers", label: t("driver_search") },
        { href: "/login", label: t("login") },
      ],
      USER: [
        { href: "/quote/request", label: t("quote_request") },
        { href: "/movers", label: t("driver_search") },
        { href: "/estimate/user", label: t("my_quotes") },
      ],
      DRIVER: [
        { href: "/estimate/driver/received", label: t("received_requests") },
        { href: "/estimate/driver/pending", label: t("my_quotes") },
      ],
    }),
    [t]
  );

  // 사용자 표시 이름 (USER: name, DRIVER: nickname)
  const displayName = isUser
    ? me?.name
    : isDriver
    ? (me as { nickname?: string })?.nickname ?? me?.name
    : undefined;

  // 프로필 이미지 (s3 이미지 조회) - React Query 사용
  const { data: profileImage } = useGetViewPresignedUrl(me?.profileImage);

  // 프로필 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 알림 드롭다운 상태 관리
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  // 언어 목록
  const languages = [
    { code: "ko" as const, label: t("language_korean") },
    { code: "en" as const, label: t("language_english") },
    { code: "zh" as const, label: t("language_chinese") },
  ];

  // 현재 언어 라벨
  const currentLanguageLabel =
    languages.find((lang) => lang.code === locale)?.label ||
    t("language_korean");

  // 메뉴 아이템 계산
  const menuItemsForNav = isGuest
    ? MENU_ITEMS.GUEST.filter((item) => item.href !== "/login") // PC 버전에서는 로그인 제외
    : isUser
    ? MENU_ITEMS.USER
    : MENU_ITEMS.DRIVER;

  const menuItemsForDrawer = isGuest
    ? MENU_ITEMS.GUEST
    : isUser
    ? MENU_ITEMS.USER
    : MENU_ITEMS.DRIVER;

  // RightSection 렌더링 함수
  const renderRightSection = () => {
    // 비로그인 상태
    if (isGuest) {
      return (
        <div className="flex items-center gap-4">
          <LanguageDropdown
            languages={languages}
            currentLocale={locale}
            currentLanguageLabel={currentLanguageLabel}
            onLanguageChange={setLocale}
          />
          <Button
            text={t("login")}
            onClick={() => router.push("/login")}
            width="100px"
            className="px-10 max-md:hidden"
          />
          <button
            className="md:hidden"
            aria-label="메뉴"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Image
              src="/assets/icon/ic-menu.svg"
              alt="menu"
              width={24}
              height={24}
            />
          </button>
        </div>
      );
    }

    // 로그인 상태
    return (
      <div className="flex items-center gap-8">
        <LanguageDropdown
          languages={languages}
          currentLocale={locale}
          currentLanguageLabel={currentLanguageLabel}
          onLanguageChange={setLocale}
        />
        <div className="relative flex items-center">
          <button
            aria-label="알림"
            onClick={() => setIsNoticeOpen((prev) => !prev)}
            className="hover:opacity-70 transition-opacity"
          >
            <Image
              src="/assets/icon/ic-alarm.svg"
              alt="alarm"
              width={36}
              height={36}
            />
          </button>
          <Notice
            isOpen={isNoticeOpen}
            onClose={() => setIsNoticeOpen(false)}
          />
        </div>
        <div className="relative">
          <div
            aria-label="프로필"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-4 cursor-pointer"
          >
            <ProfileAvatar
              src={profileImage || "/assets/image/avatartion-3.png"}
              alt="profile"
              size="xs"
              className="w-9 h-9 max-md:w-7 max-md:h-7"
              responsive={false}
            />
            {displayName && (
              <span className="pret-lg-medium text-black-400 max-md:hidden">
                {displayName}
              </span>
            )}
          </div>
          <ProfileDropdown
            isOpen={isDropdownOpen}
            isUser={isUser}
            isDriver={isDriver}
            me={me}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
        <button
          className="md:hidden"
          aria-label="메뉴"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
        >
          <Image
            src="/assets/icon/ic-menu.svg"
            alt="menu"
            width={24}
            height={24}
          />
        </button>
      </div>
    );
  };

  if (isAuthLoading) {
    return (
      <header className="border-b border-line-100 max-md:border-b-0">
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[120px] h-[54px] md:h-[84px] flex justify-between items-center">
          <Link href="/" aria-label="홈으로 이동">
            <Image
              src="/assets/image/logo.png"
              alt="logo"
              width={116}
              height={44}
              className="w-[88px] h-[34px] md:w-[116px] md:h-[44px]"
            />
          </Link>
          <p className="sr-only">로딩중...</p>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="border-b border-line-100 max-md:border-b-0">
        <div className="max-w-[1400px] mx-auto px-[16px] md:px-[120px] h-[54px] md:h-[84px] flex justify-between items-center">
          <div className="flex items-center gap-20">
            <Link href="/" aria-label="홈으로 이동">
              <Image
                src="/assets/image/logo.png"
                alt="logo"
                width={116}
                height={44}
                className="w-[88px] h-[34px] md:w-[116px] md:h-[44px]"
              />
            </Link>
            <MenuNav menuItems={menuItemsForNav} />
          </div>
          {renderRightSection()}
        </div>
      </header>
      <MenuDrawer
        menuItems={menuItemsForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
