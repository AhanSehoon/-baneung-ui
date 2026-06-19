import { exec } from './commands';
import { restoreSelection } from './selection';

import type { ImageUploadHandler } from './types';

/** File을 base64 data URL로 읽는다 (기본 인라인 삽입 전략). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** DataTransfer/Clipboard items에서 이미지 File 목록을 추출. */
export function extractImageFiles(data: DataTransfer | null): File[] {
  if (!data) return [];
  const files: File[] = [];
  // 1) files 컬렉션 (드래그앤드롭 · 일부 붙여넣기)
  if (data.files && data.files.length > 0) {
    for (const f of Array.from(data.files)) {
      if (f.type.startsWith('image/')) files.push(f);
    }
  }
  // 2) items 컬렉션 (스크린샷 붙여넣기 등 — files에 안 잡히는 경우)
  if (files.length === 0 && data.items) {
    for (const item of Array.from(data.items)) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
  }
  return files;
}

const escapeAttr = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** caret 위치에 <img> 삽입. alt는 파일명 기반. */
export function insertImage(src: string, alt = ''): void {
  exec('insertHTML', `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`);
}

/**
 * 이미지 File 목록을 업로드(또는 base64 변환) 후 caret 위치에 순서대로 삽입.
 *
 * @param files         삽입할 이미지 파일
 * @param root          contentEditable 루트 (포커스 보장용)
 * @param savedRange    삽입 직전 복원할 셀렉션 (붙여넣기/드롭 시점에 저장)
 * @param upload        업로드 핸들러. 미지정 시 base64 인라인.
 * @param onAfter       각 삽입 후 호출 (onChange 트리거용)
 */
export async function insertImageFiles(
  files: File[],
  root: HTMLElement,
  savedRange: Range | null,
  upload: ImageUploadHandler | undefined,
  onAfter: () => void,
): Promise<void> {
  for (const file of files) {
    let src: string;
    try {
      src = upload ? await upload(file) : await fileToDataUrl(file);
    } catch {
      // 업로드 실패 시 해당 파일은 건너뛴다.
      continue;
    }
    root.focus();
    restoreSelection(savedRange);
    insertImage(src, file.name.replace(/\.[^.]+$/, ''));
    onAfter();
  }
}
