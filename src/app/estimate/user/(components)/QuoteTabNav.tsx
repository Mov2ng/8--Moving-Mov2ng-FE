"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { label: "대기 중인 견적", href: "/estimate/user/pending" },
  { label: "받았던 견적", href: "/estimate/user/received" },
];

export default function QuoteTabNav() {
  const router = useRouter();
  const pathname = usePathname();

  const go = (href: string) => router.push(href);

  return (
    <nav className="flex items-center gap-6 border-b border-line-100 bg-white">
      {TABS.map((tab) => {
        const isActive = pathname?.startsWith(tab.href);
        return (
          <button
            key={tab.href}
            onClick={() => go(tab.href)}
            className={`relative pb-2 pret-lg-semibold transition-colors ${
              isActive ? "text-black-400" : "text-gray-300 hover:text-black-300"
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-black-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
