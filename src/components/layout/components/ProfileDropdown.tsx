"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLogout } from "@/hooks/useAuth";
import { useI18n } from "@/libs/i18n/I18nProvider";

type User = {
  name?: string;
  nickname?: string;
};

type ProfileDropdownProps = {
  isOpen: boolean;
  isUser: boolean;
  isDriver: boolean;
  me?: User;
  onClose: () => void;
};

export default function ProfileDropdown({
  isOpen,
  isUser,
  isDriver,
  me,
  onClose,
}: ProfileDropdownProps) {
  const { t } = useI18n();
  const logoutMutation = useLogout();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    onClose();
    logoutMutation.mutate();
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 w-55 rounded-lg border border-line-100 bg-white z-20 shadow-lg transition-all duration-200 ease-out ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="">
        {isUser ? (
          <div className="flex flex-col px-3 py-4">
            <div className="pret-lg-bold text-black-400 px-4 py-3 max-md:px-2">
              {me?.name}
              {t("customer_suffix") && ` ${t("customer_suffix")}`}
            </div>
            <Link
              href="/profile/user/edit"
              onClick={onClose}
              className="block px-4 py-3 pret-lg-regular text-black-400 hover:text-primary-blue-300 transition-colors"
            >
              {t("profile_edit")}
            </Link>
            <Link
              href="/movers/favorites"
              onClick={onClose}
              className="block px-4 py-3 pret-lg-regular text-black-400 hover:text-primary-blue-300 transition-colors"
            >
              {t("favorite_drivers")}
            </Link>
            <Link
              href="/review/writable"
              onClick={onClose}
              className="block px-4 py-3 pret-lg-regular text-black-400 hover:text-primary-blue-300 transition-colors"
            >
              {t("moving_reviews")}
            </Link>
          </div>
        ) : isDriver ? (
          <div className="flex flex-col py-2">
            <div className="pret-lg-bold text-black-400 px-4 py-3.5">
              {me?.nickname ?? me?.name} {t("driver_suffix")}
            </div>
            <Link
              href="/estimate/driver/received"
              onClick={onClose}
              className="block px-4 py-3 pret-lg-regular text-black-400 hover:text-primary-blue-300 transition-colors"
            >
              {t("received_quotes")}
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className="block px-4 py-3 pret-lg-regular text-black-400 hover:text-primary-blue-300 transition-colors"
            >
              {t("my_page")}
            </Link>
          </div>
        ) : null}
        <div className="border-t border-line-100" />
        <button
          className="w-full text-center p-4 pret-14-regular text-gray-500 hover:text-red-500 transition-colors"
          onClick={handleLogout}
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
