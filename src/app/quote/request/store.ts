"use client";

import { create, type StateCreator } from "zustand";

export type MovingType = "소형이사" | "가정이사" | "사무실이사";

export interface QuoteRequestState {
  step: 1 | 2 | 3 | 4;
  movingType: MovingType | null;
  date: Date | null;
  address: string | null;

  setStep: (step: 1 | 2 | 3 | 4) => void;
  setMovingType: (type: MovingType) => void;
  setDate: (date: Date) => void;
  setAddress: (address: string) => void;
}

const creator: StateCreator<QuoteRequestState> = (set) => ({
  step: 1,
  movingType: null,
  date: null,
  address: null,

  setStep: (step) => set({ step }),
  setMovingType: (movingType) => set({ movingType }),
  setDate: (date) => set({ date }),
  setAddress: (address) => set({ address }),
});

export const useQuoteRequestStore = create(creator);
