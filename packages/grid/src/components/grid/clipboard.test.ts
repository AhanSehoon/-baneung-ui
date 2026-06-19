import { describe, expect, it } from 'vitest';

import { buildTsv, parseTsv } from './clipboard';

describe('buildTsv', () => {
  it('serializes simple matrix with tabs and newlines', () => {
    const matrix = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    expect(buildTsv(matrix)).toBe('a\tb\tc\nd\te\tf');
  });

  it('escapes cells containing tab, newline, or quote with double quotes', () => {
    const matrix = [
      ['hello', 'with\ttab'],
      ['quote"inside', 'multi\nline'],
    ];
    expect(buildTsv(matrix)).toBe('hello\t"with\ttab"\n"quote""inside"\t"multi\nline"');
  });

  it('renders null/undefined as empty string', () => {
    expect(buildTsv([[null, undefined, 'x']])).toBe('\t\tx');
  });

  it('formats Date as ISO string', () => {
    const d = new Date('2025-01-01T00:00:00.000Z');
    expect(buildTsv([[d]])).toBe('2025-01-01T00:00:00.000Z');
  });
});

describe('parseTsv', () => {
  it('parses simple tab/newline separated matrix', () => {
    const tsv = 'a\tb\tc\nd\te\tf';
    expect(parseTsv(tsv)).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ]);
  });

  it('handles CRLF (Excel/Windows 호환)', () => {
    const tsv = 'a\tb\r\nc\td';
    expect(parseTsv(tsv)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('unwraps quoted cells with embedded tab/newline/quote', () => {
    const tsv = '"with\ttab"\t"normal"\n"a\nb"\t"quote""inside"';
    expect(parseTsv(tsv)).toEqual([
      ['with\ttab', 'normal'],
      ['a\nb', 'quote"inside'],
    ]);
  });

  it('drops trailing empty line (Excel TSV 패턴)', () => {
    const tsv = 'a\tb\n';
    expect(parseTsv(tsv)).toEqual([['a', 'b']]);
  });

  it('returns empty array for empty input', () => {
    expect(parseTsv('')).toEqual([]);
  });

  it('roundtrip: buildTsv → parseTsv 가 원본과 일치 (string only)', () => {
    const original = [
      ['Hello', 'World'],
      ['with\ttab', 'with\nnewline'],
      ['quote"inside', 'normal'],
    ];
    const round = parseTsv(buildTsv(original));
    expect(round).toEqual(original);
  });
});
