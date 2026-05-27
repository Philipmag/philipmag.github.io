import React, { createContext, useContext, useState, useEffect } from 'react';

export type TextSize = 'normal' | 'large' | 'extra-large';
export type ContrastMode = 'normal' | 'high-contrast';

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

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 'normal',
  contrastMode: 'normal',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('accessibility-settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {
        console.error('Failed to parse accessibility settings:', e);
      }
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply text size
    root.setAttribute('data-text-size', newSettings.textSize);
    
    // Apply contrast mode
    root.setAttribute('data-contrast-mode', newSettings.contrastMode);
  };

  const setTextSize = (size: TextSize) => {
    const newSettings = { ...settings, textSize: size };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const setContrastMode = (mode: ContrastMode) => {
    const newSettings = { ...settings, contrastMode: mode };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const toggleContrastMode = () => {
    const newMode = settings.contrastMode === 'normal' ? 'high-contrast' : 'normal';
    setContrastMode(newMode);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    applySettings(DEFAULT_SETTINGS);
    localStorage.removeItem('accessibility-settings');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setTextSize,
        setContrastMode,
        toggleContrastMode,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
