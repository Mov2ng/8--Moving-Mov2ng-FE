"use client";

import { create, type StateCreator } from "zustand";

type MovingType = "소형이사" | "가정이사" | "사무실이사";

export interface QuoteRequestState {
  step: 1 | 2 | 3 | 4;
  movingType?: MovingType;
  date?: Date;
  address?: string;

  setMovingType: (type: MovingType) => void;
  setDate: (date: Date) => void;
  setAddress: (address: string) => void;
}

const creator: StateCreator<QuoteRequestState> = (set) => ({
  step: 1,

  setMovingType: (movingType) => set({ movingType, step: 2 }),
  setDate: (date) => set({ date, step: 3 }),
  setAddress: (address) => set({ address, step: 4 }),
});

export const useQuoteRequestStore = create(creator);
