import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { normalizeUrl } from './commands';
import { Editor } from './editor';
import { extractImageFiles } from './image';
import { sanitizeHtml } from './sanitize';

import type { EditorHandle } from './types';

describe('Editor', () => {
  it('초기 defaultValue HTML을 렌더한다', () => {
    render(<Editor defaultValue="<p>안녕하세요</p>" ariaLabel="본문" />);
    const box = screen.getByRole('textbox', { name: '본문' });
    expect(box.innerHTML).toContain('안녕하세요');
  });

  it('툴바 버튼과 contentEditable 영역이 표시된다', () => {
    render(<Editor ariaLabel="본문" />);
    expect(screen.getByRole('toolbar', { name: '서식 도구 모음' })).toBeInTheDocument();
    expect(screen.getByLabelText('굵게 (Ctrl+B)')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '본문' })).toHaveAttribute(
      'contenteditable',
      'true',
    );
  });

  it('toolbar={false}면 툴바를 숨긴다', () => {
    render(<Editor toolbar={false} ariaLabel="본문" />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('readOnly면 편집 불가 상태로 렌더한다', () => {
    render(<Editor readOnly defaultValue="<p>읽기전용</p>" ariaLabel="본문" />);
    expect(screen.getByRole('textbox', { name: '본문' })).toHaveAttribute(
      'contenteditable',
      'false',
    );
  });

  it('ref 핸들로 HTML/텍스트를 읽고 설정할 수 있다', () => {
    const ref = React.createRef<EditorHandle>();
    render(<Editor ref={ref} defaultValue="<p>처음</p>" ariaLabel="본문" />);
    expect(ref.current?.getHTML()).toContain('처음');
    ref.current?.setHTML('<p>변경됨</p>');
    expect(ref.current?.getHTML()).toContain('변경됨');
  });

  it('비어있을 때 data-empty=true, 내용이 있으면 false', () => {
    const { rerender } = render(<Editor ariaLabel="본문" />);
    const box = screen.getByRole('textbox', { name: '본문' });
    expect(box).toHaveAttribute('data-empty', 'true');
    rerender(<Editor value="<p>내용</p>" ariaLabel="본문" />);
    expect(box).toHaveAttribute('data-empty', 'false');
  });

  it('커스텀 toolbar 구성을 반영한다', () => {
    render(<Editor toolbar={[['bold', 'italic']]} ariaLabel="본문" />);
    expect(screen.getByLabelText('굵게 (Ctrl+B)')).toBeInTheDocument();
    expect(screen.getByLabelText('기울임 (Ctrl+I)')).toBeInTheDocument();
    expect(screen.queryByLabelText('이미지 삽입')).not.toBeInTheDocument();
  });

  it('onChange가 제어 value의 echo로 무한 루프를 일으키지 않는다', () => {
    const onChange = vi.fn();
    render(<Editor value="<p>x</p>" onChange={onChange} ariaLabel="본문" />);
    // 마운트 시점에는 onChange가 호출되지 않아야 한다(외부 value 주입).
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('normalizeUrl', () => {
  it('프로토콜이 없으면 https://를 붙인다', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
  });
  it('이미 프로토콜이 있으면 그대로 둔다', () => {
    expect(normalizeUrl('http://a.com')).toBe('http://a.com');
    expect(normalizeUrl('mailto:a@b.com')).toBe('mailto:a@b.com');
    expect(normalizeUrl('#anchor')).toBe('#anchor');
    expect(normalizeUrl('/relative')).toBe('/relative');
  });
});

describe('sanitizeHtml', () => {
  it('script 태그를 제거한다', () => {
    const out = sanitizeHtml('<p>안전</p><script>alert(1)</script>');
    expect(out).toContain('안전');
    expect(out).not.toContain('<script');
  });

  it('이벤트 핸들러 속성을 제거한다', () => {
    const out = sanitizeHtml('<p onclick="evil()">텍스트</p>');
    expect(out).not.toContain('onclick');
    expect(out).toContain('텍스트');
  });

  it('javascript: href를 제거하지만 정상 링크는 유지한다', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:');
    expect(sanitizeHtml('<a href="https://ok.com">x</a>')).toContain('https://ok.com');
  });

  it('data:image 인라인 이미지 src는 유지한다', () => {
    const data = 'data:image/png;base64,iVBORw0KGgo=';
    expect(sanitizeHtml(`<img src="${data}" />`)).toContain('data:image/png');
  });

  it('허용되지 않은 태그는 언래핑한다(내용 보존)', () => {
    const out = sanitizeHtml('<section><p>유지</p></section>');
    expect(out).toContain('유지');
    expect(out).not.toContain('<section');
  });
});

describe('extractImageFiles', () => {
  it('files 컬렉션에서 이미지 파일만 추출한다', () => {
    const img = new File(['x'], 'a.png', { type: 'image/png' });
    const txt = new File(['x'], 'a.txt', { type: 'text/plain' });
    const dt = {
      files: [img, txt],
      items: null,
    } as unknown as DataTransfer;
    const result = extractImageFiles(dt);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('a.png');
  });

  it('null이면 빈 배열', () => {
    expect(extractImageFiles(null)).toEqual([]);
  });
});
