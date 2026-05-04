import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 조건부 클래스 합성 + Tailwind 충돌 해소.
 *
 * - `clsx`로 조건/배열/객체 형태의 입력을 정규화
 * - `tailwind-merge`로 충돌하는 utility를 마지막 값으로 머지
 *
 * @example
 *   cn('px-2 py-1', isActive && 'bg-bg-inverse', className)
 *   // → isActive 시: 'py-1 bg-bg-inverse <className>' (px-2를 className의 px-*가 덮어씀)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
