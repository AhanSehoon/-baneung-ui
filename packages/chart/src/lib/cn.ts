import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** clsx + tailwind-merge — Tailwind 클래스 병합 + 충돌 정리. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
