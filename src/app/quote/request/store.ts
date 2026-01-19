// app/quote/request/store.ts
"use client";

import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { getServiceValue } from "@/constants/profile.constants";

export type MovingType = "소형이사" | "가정이사" | "사무실이사";

export type SimpleAddress = {
  address: string;
  zonecode: string;
};

export type QuoteAddress = {
  origin: SimpleAddress;
  destination: SimpleAddress;
} | null;

export interface QuoteRequestState {
  step: 1 | 2 | 3 | 4;
  movingType: MovingType | null;
  date: Date | null;
  address: QuoteAddress;

  setStep: (step: 1 | 2 | 3 | 4) => void;
  setMovingType: (type: MovingType) => void;
  setDate: (date: Date) => void;
  setAddress: (address: QuoteAddress) => void;
  reset: () => void;
}

// UI -> API enum 매핑 테이블 (getServiceValue 사용)
export const MOVING_TYPE_MAP: Record<MovingType, string> = {
  "소형이사": getServiceValue("소형이사"),
  "가정이사": getServiceValue("가정이사"),
  "사무실이사": getServiceValue("사무실이사"),
};

const creator: StateCreator<QuoteRequestState> = (set) => ({
  step: 1,
  movingType: null,
  date: null,
  address: null,

  setStep: (step) => set({ step }),
  setMovingType: (movingType) => set({ movingType }),
  setDate: (date) => set({ date }),
  setAddress: (address) => set({ address }),

  reset: () =>
    set({
      step: 1,
      movingType: null,
      date: null,
      address: null,
    }),
});

// 커스텀 storage: Date 객체를 직렬화/역직렬화 처리
type StorageValue = {
  state: QuoteRequestState;
  version?: number;
};

const customStorage = {
  getItem: (name: string): StorageValue | null => {
    if (typeof window === "undefined") return null;
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const parsed = JSON.parse(str) as { state: { date?: string | Date | null } & Omit<QuoteRequestState, 'date'>; version?: number };
      // date 문자열을 Date 객체로 변환
      if (parsed?.state?.date && typeof parsed.state.date === "string") {
        parsed.state.date = new Date(parsed.state.date);
      }
      return parsed as StorageValue;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue): void => {
    if (typeof window === "undefined") return;
    try {
      // Date 객체를 ISO 문자열로 변환하여 저장
      const valueToSave: { state: { date?: string | null } & Omit<QuoteRequestState, 'date'>; version?: number } = {
        ...value,
        state: {
          ...value.state,
          date: value.state.date instanceof Date 
            ? value.state.date.toISOString()
            : value.state.date,
        },
      };
      localStorage.setItem(name, JSON.stringify(valueToSave));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

export const useQuoteRequestStore = create<QuoteRequestState>()(
  persist(creator, {
    name: "quote-request-storage",
    storage: customStorage,
  })
);
