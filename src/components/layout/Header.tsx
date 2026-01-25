"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";
import { useI18n } from "@/libs/i18n/I18nProvider";
import { getToken } from "@/libs/auth/tokenStorage";
import { DEFAULT_AVATAR_IMAGE } from "@/constants/profile.constants";
import Button from "@/components/common/button";
import Notice from "@/components/Notice/Notice";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import MenuNav from "./components/MenuNav";
import MenuDrawer from "./components/MenuDrawer";
import LanguageDropdown from "./components/LanguageDropdown";
import ProfileDropdown from "./components/ProfileDropdown";
import { useApiQuery } from "@/hooks/useApiQuery";
import { noticeService } from "@/services/noticeService";

type MenuItem = {
  href: string;
  label: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { me, isGuest, isUser, isDriver, isPending } = useAuth();
  const isAuthLoading = isMounted && isPending && !me;

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

  // 알림 데이터 조회 (읽지 않은 알림 확인용)
  const { data: noticesData } = useApiQuery({
    queryKey: ["notices", "header", me?.id],
    queryFn: () => {
      if (isUser && me?.id) {
        return noticeService.getUserNotices({ userId: me.id, page: 1, pageSize: 100 });
      } else if (isDriver && me?.id) {
        return noticeService.getDriverNotices({ userId: me.id, page: 1, pageSize: 100 });
      }
      return Promise.resolve({ data: { items: [], page: 0, pageSize: 0, totalItems: 0, totalPages: 0 } });
    },
    enabled: !isGuest && !!me?.id,
    refetchInterval: 30000, // 30초마다 알림 상태 확인
  });

  // 읽지 않은 알림이 있는지 확인
  const hasUnreadNotices = useMemo(() => {
    const notices = noticesData?.data?.items || [];
    return notices.some((notice) => !notice.isRead);
  }, [noticesData]);

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
            className="max-md:hidden"
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
            {hasUnreadNotices ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <path
                  d="M7 26L7.15928 25.6525C7.9634 23.898 8.45024 22.015 8.59724 20.0907L9.12162 13.226C9.47615 8.58495 13.3454 5 18 5C22.6546 5 26.5239 8.58495 26.8784 13.226L27.4028 20.0907C27.5498 22.015 28.0366 23.898 28.8407 25.6525L29 26"
                  stroke="#ABABAB"
                  strokeWidth="2"
                />
                <path
                  d="M29 26H7L9 21L10 11L12.5 6.5L18 5L23 6.5L26 11L27 21L29 26Z"
                  fill="#ABABAB"
                />
                <path
                  d="M7 26L29 26"
                  stroke="#ABABAB"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M21 29C21 30.6569 19.6569 32 18 32C16.3431 32 15 30.6569 15 29"
                  stroke="#ABABAB"
                  strokeWidth="2"
                />
                <circle cx="26" cy="10" r="5" fill="#FF4444" />
              </svg>
            ) : (
              <Image
                src="/assets/icon/ic-alarm.svg"
                alt="alarm"
                width={36}
                height={36}
              />
            )}
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
              src={profileImage || DEFAULT_AVATAR_IMAGE}
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

  // 마운트 전: 서버/클라이언트 동일한 플레이스홀더 (hydration 오류 방지)
  if (!isMounted) {
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
              priority
              fetchPriority="high"
            />
          </Link>
          <p className="sr-only">로딩중...</p>
        </div>
      </header>
    );
  }

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
              priority
              fetchPriority="high"
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
                priority
                fetchPriority="high"
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
