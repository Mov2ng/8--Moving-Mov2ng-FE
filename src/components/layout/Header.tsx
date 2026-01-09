"use client";

import { useAuth } from "@/hooks/useAuth";
import Button from "../common/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// 메뉴 링크 타입
type MenuItem = {
  href: string;
  label: string;
};

// 역할별 메뉴 정의
const MENU_ITEMS: Record<string, MenuItem[]> = {
  GUEST: [
    { href: "/movers", label: "기사님 찾기" },
    { href: "/login", label: "로그인" },
  ],
  USER: [
    { href: "/quote/request", label: "견적 요청" },
    { href: "/movers", label: "기사님 찾기" },
    { href: "/estimate/user", label: "내 견적 관리" },
  ],
  DRIVER: [
    { href: "/estimate/user/received", label: "받은 요청" },
    { href: "/estimate/user", label: "내 견적 관리" },
  ],
};

export default function Header() {
  const router = useRouter();
  const { me, isGuest, isLoading, isUser, isDriver } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 사용자 표시 이름 (USER: name, DRIVER: nickname)
  const displayName = isUser
    ? me?.name
    : isDriver
    ? (me as { nickname?: string })?.nickname ?? me?.name
    : undefined;

  // 프로필 이미지 (기본값 처리)
  const profileImage = me?.profileImage || "/assets/image/img-profile.png";

  // 메뉴 네비게이션 렌더링
  const renderMenuNav = () => {
    const menuItems = isGuest
      ? MENU_ITEMS.GUEST.filter((item) => item.href !== "/login") // PC 버전에서는 로그인 제외
      : isUser
      ? MENU_ITEMS.USER
      : MENU_ITEMS.DRIVER;

    return (
      <nav
        className="max-md:hidden flex items-center gap-4"
        aria-label="주요 메뉴"
      >
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="pret-lg-regular text-black-400"
          >
            {item.label}
          </Link>
        ))}
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

  // 오른쪽 섹션 렌더링
  const renderRightSection = () => {
    // 비로그인 상태
    if (isGuest) {
      return (
        <div className="flex items-center gap-4">
          <Button
            text="로그인"
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
      <div className="flex items-center gap-4">
        <button aria-label="알림" onClick={() => {}}>
          <Image
            src="/assets/icon/ic-alarm.svg"
            alt="alarm"
            width={24}
            height={24}
          />
        </button>
        <button aria-label="프로필" onClick={() => {}}>
          <Image src={profileImage} alt="profile" width={36} height={36} />
        </button>
        {displayName && (
          <span className="pret-lg-medium text-black-400 max-md:hidden">
            {displayName}
          </span>
        )}
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
        <div className="max-w-[1400px] mx-auto px-[24px] py-[15px] md:px-[120px] md:py-[26px] flex justify-between items-center">
          <div className="flex items-center gap-4">
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
