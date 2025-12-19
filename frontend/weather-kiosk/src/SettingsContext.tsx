import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Settings {
  shiftToNight: number; // minutes since midnight (0-1430)
  shiftToDay: number; // minutes since midnight (0-1430)
  cityName: string;
  latitude: number;
  longitude: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings(_newSettings: Partial<Settings>): void;
  isNightMode: boolean;
}

const STORAGE_KEY = "weather-kiosk-settings";

const defaultSettings: Settings = {
  shiftToNight: 21 * 60, // 21:00
  shiftToDay: 6 * 60, // 06:00
  cityName: "Yokohama",
  latitude: 35.4437,
  longitude: 139.638,
};

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultSettings;
}

function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function checkIsNightMode(settings: Settings): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const { shiftToNight, shiftToDay } = settings;

  if (shiftToNight > shiftToDay) {
    // Normal case: day 6:00-21:00, night 21:00-6:00
    return currentMinutes >= shiftToNight || currentMinutes < shiftToDay;
  } else {
    // Inverted case: night crosses midnight differently
    return currentMinutes >= shiftToNight && currentMinutes < shiftToDay;
  }
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [isNightMode, setIsNightMode] = useState(() =>
    checkIsNightMode(loadSettings())
  );

  useEffect(() => {
    // Check night mode every minute
    const interval = setInterval(() => {
      setIsNightMode(checkIsNightMode(settings));
    }, 60000);

    return () => clearInterval(interval);
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
    setIsNightMode(checkIsNightMode(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isNightMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
