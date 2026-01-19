'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'; // createContext: 컨텍스트 생성, useContext: 컨텍스트 사용, useState: 상태 관리, useMemo: 메모이제이션
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

/**
 * 사용자 위치 기반으로 언어 자동 감지
 * 한국 → 한국어, 중국 → 중국어, 그 외 → 영어
 */
function detectLocaleFromBrowser(): Locale {
  if (typeof window === 'undefined') {
    return 'ko'; // SSR 기본값
  }

  try {
    // localStorage에 저장된 언어 설정이 있으면 우선 사용
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    if (savedLocale && ['ko', 'en', 'zh'].includes(savedLocale)) {
      return savedLocale;
    }

    // 브라우저 언어 설정 기반으로 자동 감지
    // navigator.language: 브라우저 언어 설정, (navigator as any).userLanguage: 브라우저 언어 설정 (IE 지원)
    const browserLang = navigator.language || (navigator as any).userLanguage; 
    const langCode = browserLang.toLowerCase().split('-')[0]; // 'ko-KR' → 'ko'

    // 한국어
    if (langCode === 'ko') {
      return 'ko';
    }
    // 중국어 (간체/번체 모두)
    if (langCode === 'zh' || langCode === 'cn') {
      return 'zh';
    }
    // 그 외는 영어
    return 'en';
  } catch {
    // 에러 발생 시 기본값
    return 'ko';
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    // 초기값: localStorage 또는 브라우저 언어 기반 자동 감지
    return detectLocaleFromBrowser();
  });

  // locale 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [locale]);

  // setLocale 래퍼: localStorage 저장은 useEffect에서 처리
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const value = useMemo(() => ({
    locale,
    setLocale: handleSetLocale,
    t: (key: keyof Message) => messageMap[locale][key] ?? String(key),}), [locale]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>; // I18nContextValue 타입의 값을 저장하는 컨텍스트 생성
}

export function useI18n() {
  const context = useContext(I18nContext); // I18nContext 컨텍스트 사용
  if (!context) {
    throw new Error('useI18n must be used within a I18nProvider'); // 이 컨텍스트 바깥에 있을 때 보낼 에러
  }
  return context;
}