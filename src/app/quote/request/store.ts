// app/quote/request/store.ts
"use client";

import { create, type StateCreator } from "zustand";

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

// UI -> API enum 매핑 테이블
export const MOVING_TYPE_MAP: Record<MovingType, string> = {
  "소형이사": "SMALL",
  "가정이사": "HOME",
  "사무실이사": "OFFICE",
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

export const useQuoteRequestStore = create(creator);
