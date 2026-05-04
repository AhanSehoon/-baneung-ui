'use client';

import * as React from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'baneung-docs-theme';

/**
 * ThemeProvider — 라이트/다크 모드 토글 + 로컬 저장.
 *
 * `<html data-theme="dark">` 속성을 토글해 @baneung-pack/tokens의 CSS 변수를 cascade.
 * 하이드레이션 mismatch 방지를 위해 첫 페인트 직전에 `localStorage` 값을 읽는 inline script가 필요하지만,
 * 본 데모에서는 단순화해 client-only 토글로 처리합니다.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('light');

  // 마운트 후 저장된 테마 반영
  React.useEffect(() => {
    const stored = (typeof window !== 'undefined' &&
      window.localStorage.getItem(STORAGE_KEY)) as Theme | null;
    const initial: Theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    setThemeState(initial);
    document.documentElement.dataset['theme'] = initial;
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset['theme'] = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = React.useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme은 ThemeProvider 안에서만 사용해야 합니다.');
  }
  return ctx;
}
