import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Type for settings object
interface SettingsState {
  locale: string;
  setLocale: (locale: string) => void;
}

// Create a new storage object which keeps its value on app close,
const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: "en-GB",
      setLocale: (locale) => set(() => ({ locale: locale })),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Function that returns the current locale
const getLocale = () => useSettingsStore((state) => state.locale);

export { useSettingsStore, getLocale };
