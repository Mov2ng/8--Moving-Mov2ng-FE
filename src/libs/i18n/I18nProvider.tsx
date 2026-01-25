'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useLayoutEffect } from 'react'; 
import ko from '../../locales/ko/common.json';
import en from '../../locales/en/common.json';
import zh from '../../locales/zh/common.json';

type Locale = 'ko' | 'en' | 'zh';
// 모든 번역 파일의 키를 합쳐서 타입 정의
type Message = typeof ko & typeof en & typeof zh;

type I18nContextValue = {
  locale: Locale; // 현재 사용자의 언어 설정
  t: (key: keyof Message) => string; // 메시지 키를 받아 해당 언어의 메시지 반환
  setLocale: (locale: Locale) => void; // 언어 설정 변경
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined); // I18nContextValue 타입의 값을 저장하는 컨텍스트 생성

const messageMap : Record<Locale, Message> = { ko, en, zh }; // 언어별 메시지 매핑

const LOCALE_STORAGE_KEY = 'locale';

type I18nProviderProps = {
  children: React.ReactNode;
  initialLocale?: Locale; // 서버에서 전달받은 초기 locale (Accept-Language 헤더 기반)
};

export function I18nProvider({ children, initialLocale = 'ko' }: I18nProviderProps) {
  // hydration 에러 방지: 서버와 클라이언트 모두 동일한 initialLocale 사용
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 첫 렌더에서 localStorage 값 확인 및 적용 (페인트 전 실행)
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (saved && ['ko', 'en', 'zh'].includes(saved)) {
        setLocale(saved);
      } else {
        // localStorage에 없으면 서버 초기값 저장
        localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
      }
    } catch {
      // localStorage 접근 실패 시 무시
    }
    setIsHydrated(true);
  }, [initialLocale]);

  // locale 변경 시 html lang 동기화
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.lang = locale;
  }, [locale]);

  // locale 변경 시 localStorage 저장 (hydration 완료 후에만)
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;
    
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // localStorage 저장 실패 시 무시
    }
  }, [locale, isHydrated]);

  // setLocale 래퍼
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const value = useMemo(() => ({
    locale,
    setLocale: handleSetLocale,
    t: (key: keyof Message) => messageMap[locale][key] ?? String(key),}), [locale]);

    return (
      <I18nContext.Provider value={value}>
        {children}
      </I18nContext.Provider>
    );
}

export function useI18n() {
  const context = useContext(I18nContext); // I18nContext 컨텍스트 사용
  if (!context) {
    throw new Error('useI18n must be used within a I18nProvider'); // 이 컨텍스트 바깥에 있을 때 보낼 에러
  }
  return context;
}