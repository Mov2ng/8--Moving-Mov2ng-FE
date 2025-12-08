'use client';

import React, { createContext, useContext, useState, useMemo } from 'react'; // createContext: 컨텍스트 생성, useContext: 컨텍스트 사용, useState: 상태 관리, useMemo: 메모이제이션
import ko from '../../locales/ko/common.json';
import en from '../../locales/en/common.json';
import zh from '../../locales/zh/common.json';

type Locale = 'ko' | 'en' | 'zh';
type Message = typeof ko;

type I18nContextValue = {
  locale: Locale; // 현재 사용자의 언어 설정
  t: (key: keyof Message) => string; // 메시지 키를 받아 해당 언어의 메시지 반환
  setLocale: (locale: Locale) => void; // 언어 설정 변경
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined); // I18nContextValue 타입의 값을 저장하는 컨텍스트 생성

const messageMap : Record<Locale, Message> = { ko, en, zh }; // 언어별 메시지 매핑

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ko');

  const value = useMemo(() => ({
    locale,
    setLocale,
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