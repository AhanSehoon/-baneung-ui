/**
 * 셀렉션 저장/복원 유틸.
 *
 * 비동기 이미지 업로드 중 사용자가 포커스를 잃거나 다른 곳을 클릭하면 caret이
 * 사라진다. 업로드 시작 시점의 Range를 저장했다가 완료 후 복원해 정확한 위치에
 * 이미지를 삽입한다.
 */

/** 현재 셀렉션 Range를 복제해 반환 (root 내부일 때만). */
export function saveSelection(root: HTMLElement): Range | null {
  if (typeof window === 'undefined') return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

/** 저장한 Range를 현재 셀렉션으로 복원. */
export function restoreSelection(range: Range | null): void {
  if (!range || typeof window === 'undefined') return;
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

/** caret을 root의 맨 끝으로 이동. */
export function placeCaretAtEnd(root: HTMLElement): void {
  if (typeof window === 'undefined') return;
  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}
