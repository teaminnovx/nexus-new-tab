import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { FontSettings, BackgroundSettings, WidgetLayout } from '@/lib/storage';
import { loadFonts, applyFontSettings, initFonts } from '@/lib/fonts';

interface SettingsContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  fontSettings: FontSettings | null;
  setFontSettings: (settings: FontSettings) => Promise<void>;
  backgroundSettings: BackgroundSettings | null;
  setBackgroundSettings: (settings: BackgroundSettings) => Promise<void>;
  widgetLayout: WidgetLayout | null;
  setWidgetLayout: (layout: WidgetLayout) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeStorage] = useStorage('theme');
  const [fontSettings, setFontSettingsStorage, fontLoading] = useStorage('fontSettings');
  const [backgroundSettings, setBackgroundSettingsStorage, bgLoading] = useStorage('backgroundSettings');
  const [widgetLayout, setWidgetLayoutStorage, layoutLoading] = useStorage('widgetLayout');
  const [fontsInitialized, setFontsInitialized] = useState(false);

  // Initialize fonts
  useEffect(() => {
    initFonts().then(() => setFontsInitialized(true));
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }
  }, [theme]);

  // Apply font settings
  useEffect(() => {
    if (fontSettings && fontsInitialized) {
      loadFonts([fontSettings.headingFont, fontSettings.bodyFont, fontSettings.monoFont])
        .then(() => applyFontSettings(fontSettings));
    }
  }, [fontSettings, fontsInitialized]);

  const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    await setThemeStorage(newTheme);
  };

  const setFontSettings = async (settings: FontSettings) => {
    await setFontSettingsStorage(settings);
  };

  const setBackgroundSettings = async (settings: BackgroundSettings) => {
    await setBackgroundSettingsStorage(settings);
  };

  const setWidgetLayout = async (layout: WidgetLayout) => {
    await setWidgetLayoutStorage(layout);
  };

  const isLoading = fontLoading || bgLoading || layoutLoading || !fontsInitialized;

  return (
    <SettingsContext.Provider
      value={{
        theme: theme ?? 'dark',
        setTheme,
        fontSettings,
        setFontSettings,
        backgroundSettings,
        setBackgroundSettings,
        widgetLayout,
        setWidgetLayout,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
