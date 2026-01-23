"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  href: string;
  label: string;
};

type MenuNavProps = {
  menuItems: MenuItem[];
};

export default function MenuNav({ menuItems }: MenuNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="max-md:hidden flex items-center gap-10"
      aria-label="주요 메뉴"
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`pret-lg-regular font-bold transition-colors ${
              isActive ? "text-black-400" : "text-gray-500 hover:text-black-400"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
