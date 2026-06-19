/**
 * 경량 HTML 새니타이저.
 *
 * 붙여넣기·HTML 소스 입력 시 스크립트/이벤트 핸들러/위험 요소를 제거한다.
 * 외부 의존성(DOMPurify 등) 없이 DOMParser로 트리를 순회하며 화이트리스트
 * 기반으로 정리한다. XSS 100% 차단을 보장하는 보안 경계가 아니라, 신뢰된
 * 사용자 입력을 합리적으로 정돈하는 용도다(서버 측 추가 새니타이즈 권장).
 */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'span',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'sub',
  'sup',
  'mark',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'a',
  'img',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'font',
]);

const ALLOWED_ATTRS = new Set([
  'href',
  'target',
  'rel',
  'src',
  'alt',
  'title',
  'colspan',
  'rowspan',
  'style',
  'color',
  'face',
  'size',
  'align',
  'width',
  'height',
]);

const DANGEROUS_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta']);

/** style 속성에서 위험한 값(expression, url(javascript:) 등) 차단. */
function safeStyle(value: string): string {
  if (/expression\s*\(|javascript:|url\s*\(\s*['"]?\s*javascript:/i.test(value)) return '';
  return value;
}

function sanitizeUrl(value: string): string | null {
  const v = value.trim();
  // data:image/* 는 인라인 이미지용으로 허용. 그 외 data:/javascript: 차단.
  if (/^data:image\//i.test(v)) return v;
  if (/^(javascript|data|vbscript):/i.test(v)) return null;
  return v;
}

function cleanElement(el: Element): void {
  const tag = el.tagName.toLowerCase();

  if (DANGEROUS_TAGS.has(tag)) {
    el.remove();
    return;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    // 허용되지 않은 태그는 자식만 남기고 언래핑.
    const parent = el.parentNode;
    if (parent) {
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    }
    return;
  }

  // 속성 정리.
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase();
    if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (name === 'href' || name === 'src') {
      const safe = sanitizeUrl(attr.value);
      if (safe === null) el.removeAttribute(attr.name);
      else el.setAttribute(attr.name, safe);
    }
    if (name === 'style') {
      const safe = safeStyle(attr.value);
      if (safe) el.setAttribute('style', safe);
      else el.removeAttribute('style');
    }
  }

  // 링크는 새 탭 + noopener 강제.
  if (tag === 'a' && el.getAttribute('href')) {
    el.setAttribute('rel', 'noopener noreferrer');
  }

  // 자식 재귀 (라이브 컬렉션 변형 대비 스냅샷).
  for (const child of Array.from(el.children)) {
    cleanElement(child);
  }
}

/** HTML 문자열을 새니타이즈해 반환. */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  for (const child of Array.from(doc.body.children)) {
    cleanElement(child);
  }
  return doc.body.innerHTML;
}
