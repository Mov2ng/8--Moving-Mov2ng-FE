"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReviewTabNav() {
  const pathname = usePathname();
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
        작성 가능한 리뷰
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
        내가 작성한 리뷰
        {isWritten && (
          <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-black-400" />
        )}
      </Link>
    </nav>
  );
}
