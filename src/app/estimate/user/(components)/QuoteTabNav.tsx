"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function QuoteTabNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  const tabs = [
    { label: t("tab_pending_quotes"), href: "/estimate/user/pending" },
    { label: t("tab_received_quotes"), href: "/estimate/user/received" },
  ];

  const go = (href: string) => router.push(href);

  return (
    <nav className="flex items-center gap-6 bg-white">
      {tabs.map((tab) => {
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
