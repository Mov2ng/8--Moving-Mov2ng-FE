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

type I18nProviderProps = {
  children: React.ReactNode;
  initialLocale?: Locale; // 서버에서 전달받은 초기 locale (Accept-Language 헤더 기반)
};

export function I18nProvider({ children, initialLocale = 'ko' }: I18nProviderProps) {
  // 서버에서 전달받은 initialLocale을 사용하여 서버와 클라이언트가 동일한 값으로 시작
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // 클라이언트 마운트 후 localStorage 확인 및 동기화
  useEffect(() => {
    try {
      // localStorage에 저장된 언어가 있으면 우선 사용
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
      if (savedLocale && ['ko', 'en', 'zh'].includes(savedLocale)) {
        // localStorage 값이 서버에서 감지한 값과 다르면 localStorage 값으로 업데이트
        if (savedLocale !== locale) {
          setLocale(savedLocale);
        }
        return;
      }

      // localStorage에 없으면 서버에서 감지한 값(initialLocale)을 localStorage에 저장
      // (이미 서버에서 Accept-Language 헤더로 감지했으므로 동일한 값일 가능성이 높음)
      localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
    } catch {
      // localStorage 접근 실패 시 기본값 유지
    }
  }, []); // 마운트 시 한 번만 실행

  // locale 변경 시 localStorage에 저장 (쿠키 제거로 성능 최적화)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      } catch {
        // localStorage 저장 실패 시 무시
      }
    }
  }, [locale]);

  // setLocale 래퍼: 쿠키와 localStorage 저장은 useEffect에서 처리
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