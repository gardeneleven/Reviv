// src/store/usePhaseStore.ts
"use client"
import { create } from 'zustand';

type PhaseState = {
  phase: 'drop' | 'float' | 'scroll' | 'shake' | 'flavors';
  setPhase: (phase: PhaseState['phase']) => void;
};

export const usePhaseStore = create<PhaseState>((set) => ({
  phase: 'drop',
  setPhase: (phase) => set({ phase }),
}));
