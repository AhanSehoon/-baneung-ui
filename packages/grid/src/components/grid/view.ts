import type { GridView } from './types';

/** localStorage 키 prefix — 다른 라이브러리와 충돌 방지. */
const STORAGE_PREFIX = 'baneung-grid:';

/**
 * 저장된 view를 localStorage에서 로드.
 *
 * - SSR 안전 (window 가드)
 * - JSON 파싱 실패 시 null 반환 (자동 복구)
 * - 유효성: 객체 형태만 반환, 필드는 일부만 있어도 OK (Partial)
 */
export function loadGridView(viewKey: string): Partial<GridView> | null {
  if (typeof window === 'undefined') return null;
  try {
    const json = window.localStorage.getItem(STORAGE_PREFIX + viewKey);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object') return parsed as Partial<GridView>;
    return null;
  } catch {
    return null;
  }
}

/**
 * view를 localStorage에 저장.
 *
 * - SSR 안전
 * - QuotaExceededError 등은 무시 (저장 못해도 UI 동작은 그대로)
 */
export function saveGridView(viewKey: string, view: GridView): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + viewKey, JSON.stringify(view));
  } catch {
    // 저장 실패는 무시
  }
}

/** 저장된 view 제거. */
export function clearGridView(viewKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + viewKey);
  } catch {
    // ignore
  }
}
