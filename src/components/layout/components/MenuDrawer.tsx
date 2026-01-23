"use client";

import Link from "next/link";
import Image from "next/image";

type MenuItem = {
  href: string;
  label: string;
};

type MenuDrawerProps = {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
};

export default function MenuDrawer({
  menuItems,
  isOpen,
  onClose,
}: MenuDrawerProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-10 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 사이드 드로어 */}
      <nav
        className={`md:hidden fixed flex flex-col gap-4 top-0 right-0 w-55 h-full bg-white z-20 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="주요 메뉴"
      >
        <div className="flex justify-end items-center px-4 py-3 border-b border-line-100">
          <Image
            src="/assets/icon/ic-cancel.svg"
            alt="close"
            width={24}
            height={24}
            onClick={onClose}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          />
        </div>
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-black-400 hover:bg-gray-50 hover:text-primary-blue-300 transition-colors"
            onClick={onClose}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
