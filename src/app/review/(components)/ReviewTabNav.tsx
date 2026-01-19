"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function ReviewTabNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const isWritable = pathname?.startsWith("/review/writable");
  const isWritten = pathname?.startsWith("/review/written");

  return (
    <nav className="flex items-center gap-6 bg-white">
      <Link
        href="/review/writable"
        className={`relative pb-2 pret-lg-semibold transition-colors ${
          isWritable ? "text-black-400" : "text-gray-300 hover:text-black-300"
        }`}
      >
        {t("review_tab_writable")}
        {isWritable && (
          <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-black-400" />
        )}
      </Link>
      <Link
        href="/review/written"
        className={`relative pb-2 pret-lg-semibold transition-colors ${
          isWritten ? "text-black-400" : "text-gray-300 hover:text-black-300"
        }`}
      >
        {t("review_tab_written")}
        {isWritten && (
          <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-black-400" />
        )}
      </Link>
    </nav>
  );
}
