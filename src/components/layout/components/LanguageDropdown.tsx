"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

type Language = {
  code: "ko" | "en" | "zh";
  label: string;
};

type LanguageDropdownProps = {
  languages: Language[];
  currentLocale: string;
  currentLanguageLabel: string;
  onLanguageChange: (code: "ko" | "en" | "zh") => void;
};

export default function LanguageDropdown({
  languages,
  currentLocale,
  currentLanguageLabel,
  onLanguageChange,
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="pret-lg-regular text-black-400 flex items-center gap-1 px-2 py-1 hover:text-primary-blue-300 transition-colors"
        aria-label="언어 선택"
      >
        {currentLanguageLabel}
        <Image
          src="/assets/icon/ic-chevron-down.svg"
          alt="chevron"
          width={16}
          height={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute top-full right-0 mt-2 w-32 rounded-lg border border-line-100 bg-white z-30 shadow-lg transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              onLanguageChange(lang.code);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 pret-lg-regular hover:bg-primary-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              currentLocale === lang.code
                ? "text-primary-blue-300 bg-primary-blue-50"
                : "text-black-400"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
