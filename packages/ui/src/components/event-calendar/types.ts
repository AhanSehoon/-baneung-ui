import type { CalendarLocale } from '../calendar';
import type { Locale } from 'date-fns';

/**
 * 이벤트 색상 — 토큰 시맨틱 키.
 * 내장 6종 외에 임의 hex/css color string도 허용 (예: `#5BA8A0`).
 */
export type EventColor = 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'purple' | (string & {});

/**
 * 캘린더에 표시할 단일 일정.
 *  - 1일짜리: `start === end` 또는 same day
 *  - 다일 range: `end > start`
 *  - 종일: `allDay: true` (시간 미표시)
 *  - 시간 지정: `allDay: false` + start의 시:분 노출
 */
export interface CalendarEvent {
  /** 고유 식별자. 클릭/드래그/리렌더 키로 사용. */
  id: string;
  /** 시작 일시. */
  start: Date;
  /** 종료 일시. 1일짜리면 start와 같거나 같은 날 23:59 권장. */
  end: Date;
  /** 표시 제목. */
  title: string;
  /** 색상. 토큰 키 또는 임의 색. 미지정 시 'blue'. */
  color?: EventColor;
  /** 종일 일정. true면 시간 미표시. 기본 true. */
  allDay?: boolean;
  /** 일정 클릭 시 호출 데이터로 함께 전달할 임의 속성. */
  meta?: Record<string, unknown>;
}

/**
 * Calendar 메인 컴포넌트의 props.
 */
export interface CalendarProps {
  /** 표시할 일정 배열. */
  events: CalendarEvent[];
  /** 표시 월 (controlled). */
  month?: Date;
  /** 표시 월 초기값 (uncontrolled). 기본 오늘. */
  defaultMonth?: Date;
  /** 월 변경 콜백 — 이전/다음 또는 dropdown 변경 시. */
  onMonthChange?: (date: Date) => void;
  /** 일정 클릭 콜백. */
  onEventClick?: (event: CalendarEvent) => void;
  /**
   * 일정 드래그-드롭 이동 콜백. 함수 전달 시 드래그 활성화.
   * @param event - 이동된 일정
   * @param newStart - 새 시작 일시 (시간은 원본 유지, 날짜만 이동)
   * @param newEnd - 새 종료 일시 (원본 duration 유지)
   */
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  /**
   * 셀당 최대 표시 일정 수. 초과 시 "+N 더보기" 표시.
   * 기본 3.
   */
  maxVisible?: number;
  /**
   * 표시 언어. Calendar와 동일 — 'ko' 기본, date-fns Locale 허용.
   */
  locale?: CalendarLocale | Locale;
  /** className. */
  className?: string;
}
