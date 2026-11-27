import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
export type TextSize = "normal" | "large" | "extra-large";
export type ContrastMode = "normal" | "high-contrast";
interface AccessibilitySettings {
  textSize: TextSize;
  contrastMode: ContrastMode;
}
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setTextSize: (size: TextSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
  toggleContrastMode: () => void;
  resetSettings: () => void;
}
const defaults: AccessibilitySettings = {
  textSize: "normal",
  contrastMode: "normal",
};
const Context = createContext<AccessibilityContextType | undefined>(undefined);
export function parseAccessibilitySettings(
  value: string | null
): AccessibilitySettings {
  try {
    const parsed = JSON.parse(value || "null");
    return {
      textSize: ["normal", "large", "extra-large"].includes(parsed?.textSize)
        ? parsed.textSize
        : "normal",
      contrastMode:
        parsed?.contrastMode === "high-contrast" ? "high-contrast" : "normal",
    };
  } catch {
    return { ...defaults };
  }
}
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      return parseAccessibilitySettings(
        localStorage.getItem("accessibility-settings")
      );
    } catch {
      return { ...defaults };
    }
  });
  useEffect(() => {
    document.documentElement.dataset.textSize = settings.textSize;
    document.documentElement.dataset.contrastMode = settings.contrastMode;
    try {
      localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    } catch {
      /* Reading controls still work without storage. */
    }
  }, [settings]);
  const setTextSize = (textSize: TextSize) =>
    setSettings(previous => ({ ...previous, textSize }));
  const setContrastMode = (contrastMode: ContrastMode) =>
    setSettings(previous => ({ ...previous, contrastMode }));
  const toggleContrastMode = () =>
    setSettings(previous => ({
      ...previous,
      contrastMode:
        previous.contrastMode === "normal" ? "high-contrast" : "normal",
    }));
  const resetSettings = () => setSettings({ ...defaults });
  return (
    <Context.Provider
      value={{
        settings,
        setTextSize,
        setContrastMode,
        toggleContrastMode,
        resetSettings,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAccessibility() {
  const value = useContext(Context);
  if (!value)
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  return value;
}
