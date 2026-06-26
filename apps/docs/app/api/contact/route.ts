import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * 프로젝트 문의 폼 수신 → 이메일 발송 API.
 *
 * 환경변수:
 *  - `RESEND_API_KEY` (필수): Resend 콘솔에서 발급. 미설정 시 503 반환.
 *  - `CONTACT_FROM_EMAIL` (선택): 발신 주소. 미설정 시 Resend 샌드박스 `onboarding@resend.dev`
 *    사용(받는 사람이 본인 계정 이메일이어야 함). 운영에선 검증된 도메인 주소 권장.
 *  - `CONTACT_TO_EMAIL` (선택): 수신 주소. 미설정 시 `ash@reacting.kr` 고정.
 *
 * 요청 바디:
 *  - title: string (1~120자)
 *  - content: string (1~5000자)
 *  - email: string (선택) — 답장받을 주소
 *
 * 응답:
 *  - 200 `{ ok: true }` 성공
 *  - 400 `{ ok: false, error }` 입력 검증 실패
 *  - 503 `{ ok: false, error }` 메일러 미설정
 *  - 500 `{ ok: false, error }` 발송 실패
 *
 * Edge runtime을 쓰지 않음 — Resend SDK는 Node 환경 일급 지원, edge에선 fetch 폴리필 의존.
 */
export const runtime = 'nodejs';

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'ash@reacting.kr';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';
const API_KEY = process.env.RESEND_API_KEY;

interface ContactRequest {
  title?: unknown;
  content?: unknown;
  email?: unknown;
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { ok: false, error: 'RESEND_API_KEY가 설정되지 않았습니다.' },
      { status: 503 },
    );
  }

  let body: ContactRequest;
  try {
    body = (await req.json()) as ContactRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON 파싱 실패' }, { status: 400 });
  }

  const title = isString(body.title) ? body.title.trim() : '';
  const content = isString(body.content) ? body.content.trim() : '';
  const email = isString(body.email) ? body.email.trim() : '';

  // 검증 — 공백·길이·이메일 형식.
  if (!title || title.length > 120) {
    return NextResponse.json({ ok: false, error: '제목은 1~120자여야 합니다.' }, { status: 400 });
  }
  if (!content || content.length > 5000) {
    return NextResponse.json({ ok: false, error: '내용은 1~5000자여야 합니다.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: '이메일 형식 오류' }, { status: 400 });
  }

  const resend = new Resend(API_KEY);
  const safeTitle = escapeHtml(title);
  const safeContent = escapeHtml(content).replace(/\n/g, '<br/>');
  const safeEmail = email ? escapeHtml(email) : '(미입력)';

  try {
    const { error } = await resend.emails.send({
      from: `바능 디자인 시스템 문의 <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      // 답장 클릭 시 문의자 주소로 바로 회신되도록 reply-to 설정.
      ...(email && { replyTo: email }),
      subject: `[바능 디자인 시스템 문의] ${title}`,
      html: `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#1F2937">
  <h2 style="margin:0 0 12px;font-size:18px;color:#1F2937">새 프로젝트 문의가 도착했습니다</h2>
  <table style="border-collapse:collapse;width:100%;margin:16px 0">
    <tr><td style="padding:8px;border:1px solid #E9ECEF;background:#F8F9FA;width:100px"><b>제목</b></td><td style="padding:8px;border:1px solid #E9ECEF">${safeTitle}</td></tr>
    <tr><td style="padding:8px;border:1px solid #E9ECEF;background:#F8F9FA"><b>답장 주소</b></td><td style="padding:8px;border:1px solid #E9ECEF">${safeEmail}</td></tr>
  </table>
  <div style="padding:12px;border:1px solid #E9ECEF;background:#F8F9FA;white-space:pre-wrap">${safeContent}</div>
  <p style="margin-top:16px;color:#6B7280;font-size:12px">— @baneung-pack 문서 사이트의 문의 폼에서 자동 발송된 메일입니다.</p>
</div>`,
      text: `[바능 디자인 시스템 문의] ${title}\n\n답장 주소: ${email || '(미입력)'}\n\n${content}\n\n— @baneung-pack 문서 사이트 문의 폼`,
    });

    if (error) {
      console.error('[contact] Resend error', error);
      return NextResponse.json({ ok: false, error: '이메일 발송 실패' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] unexpected error', err);
    return NextResponse.json({ ok: false, error: '서버 오류' }, { status: 500 });
  }
}
