import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  locale: string;
  setLocale: (locale: string) => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      locale: "ro-RO",
      setLocale: (locale) => set((state) => ({ locale: locale })),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const getLocale = () => useSettingsStore((state) => state.locale);

export { useSettingsStore, getLocale };
