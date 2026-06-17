import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * clsx + tailwind-merge — 조건부 클래스 + 충돌 해결.
 *
 * @baneung-pack/ui와 동일 시그니처. 별도 ui 패키지에서 import하면 cn이 다른
 * tailwind-merge 인스턴스를 쓰게 되므로 chart 패키지에 자체 사본 유지.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
