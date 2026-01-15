"use client";

import { useAuth, useLogout } from "@/hooks/useAuth";
import Button from "../common/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import { useI18n } from "@/libs/i18n/I18nProvider";
import Notice from "../Notice/Notice";
import ProfileAvatar from "../common/ProfileAvatar";

// 메뉴 링크 타입
type MenuItem = {
  href: string;
  label: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { me, isGuest, isLoading, isUser, isDriver } = useAuth();
  const logoutMutation = useLogout();
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
  // 드롭다운 영역 참조
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 언어 선택 드롭다운 상태 관리
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  // 언어 드롭다운 영역 참조
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // 알림 드롭다운 상태 관리
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  // 알림 드롭다운 영역 참조
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      // 드롭다운 영역 외부 클릭 시 닫기
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    // 외부 클릭 이벤트 등록
    document.addEventListener("click", handleClick);
    // 컴포넌트 언마운트 시 이벤트 정리
    return () => document.removeEventListener("click", handleClick);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isLanguageDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      // 언어 드롭다운 영역 외부 클릭 시 닫기
      if (!languageDropdownRef.current?.contains(e.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    // 외부 클릭 이벤트 등록
    document.addEventListener("click", handleClick);
    // 컴포넌트 언마운트 시 이벤트 정리
    return () => document.removeEventListener("click", handleClick);
  }, [isLanguageDropdownOpen]);

  useEffect(() => {
    if (!isNoticeOpen) return;
    const handleClick = (e: MouseEvent) => {
      // 알림 드롭다운 영역 외부 클릭 시 닫기
      if (!noticeRef.current?.contains(e.target as Node)) {
        setIsNoticeOpen(false);
      }
    };
    // 외부 클릭 이벤트 등록
    document.addEventListener("click", handleClick);
    // 컴포넌트 언마운트 시 이벤트 정리
    return () => document.removeEventListener("click", handleClick);
  }, [isNoticeOpen]);

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

  // 메뉴 네비게이션 렌더링
  const renderMenuNav = () => {
    const menuItems = isGuest
      ? MENU_ITEMS.GUEST.filter((item) => item.href !== "/login") // PC 버전에서는 로그인 제외
      : isUser
      ? MENU_ITEMS.USER
      : MENU_ITEMS.DRIVER;

    return (
      <nav
        className="max-md:hidden flex items-center gap-10"
        aria-label="주요 메뉴"
      >
        {menuItems.map((item) => {
          // 현재 경로와 메뉴 링크 경로가 일치하는지 확인
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pret-lg-regular font-bold ${
                isActive ? "text-black-400" : "text-gray-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  };

  // 메뉴 사이드 패널 렌더링
  const renderMenuDrawer = () => {
    const menuItems = isGuest
      ? MENU_ITEMS.GUEST
      : isUser
      ? MENU_ITEMS.USER
      : MENU_ITEMS.DRIVER;

    return (
      <nav
        className="md:hidden fixed flex flex-col gap-4 top-0 right-0 w-55 h-full bg-white z-20"
        aria-label="주요 메뉴"
      >
        <div className="flex justify-end items-center px-4 py-3 border-b border-line-100">
          <Image
            src="/assets/icon/ic-cancel.svg"
            alt="close"
            width={24}
            height={24}
            onClick={() => setIsDrawerOpen(false)}
            className="cursor-pointer"
          />
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-black-400"
            onClick={() => setIsDrawerOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  };

  // 언어 선택 드롭다운 렌더링
  const renderLanguageSelector = () => {
    return (
      <div ref={languageDropdownRef} className="relative">
        <button
          onClick={() => setIsLanguageDropdownOpen((prev) => !prev)}
          className="pret-lg-regular text-black-400 flex items-center gap-1 px-2 py-1 hover:text-primary-blue-300 transition-colors"
          aria-label="언어 선택"
        >
          {currentLanguageLabel}
          <Image
            src="/assets/icon/ic-chevron-down.svg"
            alt="chevron"
            width={16}
            height={16}
            className={
              isLanguageDropdownOpen
                ? "rotate-180 transition-transform"
                : "transition-transform"
            }
          />
        </button>
        {isLanguageDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-32 rounded-lg border border-line-100 bg-white z-30 shadow-lg">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setIsLanguageDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 pret-lg-regular hover:bg-primary-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  locale === lang.code
                    ? "text-primary-blue-300 bg-primary-blue-50"
                    : "text-black-400"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 오른쪽 섹션 렌더링
  const renderRightSection = () => {
    // 비로그인 상태
    if (isGuest) {
      return (
        <div className="flex items-center gap-4">
          {renderLanguageSelector()}
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
        {renderLanguageSelector()}
        <div ref={noticeRef} className="relative">
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
        <div ref={dropdownRef} className="relative">
          <div
            aria-label="프로필"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-4 cursor-pointer"
          >
            <ProfileAvatar
              src={profileImage || "/assets/image/avatar-3.png"}
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
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-55 rounded-lg border border-line-100 p-4 bg-white z-20 shadow-lg">
              {isUser ? (
                <div className="flex flex-col px-6">
                  <div className="text-lg font-bold py-3.5">
                    {me?.name}
                    {t("customer_suffix") && ` ${t("customer_suffix")}`}
                  </div>
                  <div className="py-3.5">
                    <Link
                      href="/profile/user/edit"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("profile_edit")}
                    </Link>
                  </div>
                  <div className="py-3.5">
                    <Link
                      href="/movers/favorites"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("favorite_drivers")}
                    </Link>
                  </div>
                  <div className="py-3.5">
                    <Link
                      href="/review/user"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("moving_reviews")}
                    </Link>
                  </div>
                </div>
              ) : isDriver ? (
                <div className="flex flex-col px-6">
                  <div className="text-lg font-bold py-3.5">
                    {me?.nickname ?? me?.name} {t("driver_suffix")}
                  </div>
                  <div className="py-3.5">
                    <Link
                      href="/estimate/user/received"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("received_quotes")}
                    </Link>
                  </div>
                  <div className="py-3.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t("my_page")}
                    </Link>
                  </div>
                </div>
              ) : null}
              <div className="border-t border-line-100 my-3" />
              <button
                className="w-full text-center py-1.5 text-sm text-gray-500"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logoutMutation.mutate();
                }}
              >
                {t("logout")}
              </button>
            </div>
          )}
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

  if (isLoading) {
    return (
      <header className="border-b border-line-100 max-md:border-b-0">
        <div className="max-w-[1400px] mx-auto px-[24px] py-[15px] md:py-[26px] flex justify-between items-center">
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
        <div className="max-w-[1400px] mx-auto px-[24px] py-[10px] md:px-[120px] md:py-[26px] flex justify-between items-center">
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
            {renderMenuNav()}
          </div>
          {renderRightSection()}
        </div>
      </header>
      {isDrawerOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true" // 순수 장식용
          />
          {renderMenuDrawer()}
        </>
      )}
    </>
  );
}
