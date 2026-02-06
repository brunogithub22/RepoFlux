// store/useStore.ts
import { create } from 'zustand';

interface AppState {
    isLoggedIn: boolean;
    Login: (value: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    isLoggedIn: false,
    Login: (value) => set({ isLoggedIn: value }),
}));