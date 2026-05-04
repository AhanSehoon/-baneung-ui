/**
 * 중첩 객체를 dot-notation 평면 키로 펼친다.
 * 예: `{ color: { bg: { canvas: '#fff' } } }` → `{ 'color.bg.canvas': '#fff' }`.
 */

export type FlatRecord = Record<string, string | number>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function flatten(
  obj: Record<string, unknown>,
  prefix = '',
  out: FlatRecord = {},
): FlatRecord {
  for (const [key, value] of Object.entries(obj)) {
    const compositeKey = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      flatten(value, compositeKey, out);
    } else if (typeof value === 'string' || typeof value === 'number') {
      out[compositeKey] = value;
    }
  }
  return out;
}
