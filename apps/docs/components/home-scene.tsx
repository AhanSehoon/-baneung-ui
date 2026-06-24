'use client';

import Matter from 'matter-js';
import { useEffect, useRef } from 'react';

/**
 * 36 Days of Type 스타일 — 2D Canvas 위에 검정 텍스트가 떨어지며 흩어지고 쌓임.
 *
 * - Matter.js 2D 물리 엔진 (~80KB)
 * - Canvas 2D로 직접 텍스트 렌더 (3D 변환 불필요)
 * - 각 단어는 사각형 hull로 물리 시뮬레이션 + 글자 fillText로 렌더
 * - 마우스 드래그: Matter.MouseConstraint로 자동 처리
 */

interface WordSpec {
  text: string;
  /** 폰트 크기(px). 큰 단어는 무겁고 크게, 작은 단어는 가볍게. */
  size: number;
}

// 15개로 큐레이션 — 4개 상위 패키지(UI/Grid/Chart/Editor) + Tokens + 카테고리별 대표 컴포넌트.
const WORDS: WordSpec[] = [
  // 상위 패키지 (5)
  { text: 'UI', size: 220 },
  { text: 'Grid', size: 200 },
  { text: 'Chart', size: 190 },
  { text: 'Editor', size: 180 },
  { text: 'Tokens', size: 170 },
  // UI 대표 컴포넌트 (5)
  { text: 'Button', size: 150 },
  { text: 'Dialog', size: 160 },
  { text: 'Select', size: 140 },
  { text: 'Tabs', size: 170 },
  { text: 'Calendar', size: 110 },
  // Grid (2)
  { text: 'Excel', size: 180 },
  { text: 'Tree', size: 200 },
  // Chart (2)
  { text: 'BarChart', size: 120 },
  { text: 'FlowChart', size: 95 },
  // Editor (1)
  { text: 'WYSIWYG', size: 115 },
];

interface WordBody {
  body: Matter.Body;
  text: string;
  size: number;
  /** 측정된 텍스트 폭(px) — render 시 캐싱. */
  w: number;
  /** 시각적 글자 높이(폰트 size의 약 0.72). */
  h: number;
}

export function HomeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 폰트 family — Pretendard 우선, fallback 시스템.
    const FONT_FAMILY =
      '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

    // ── Canvas 사이즈 + DPR ──────────────────────────────────────────────────
    let cssW = 0;
    let cssH = 0;
    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container!.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      // 한 번만 scale → 이후 fillText는 CSS 픽셀 좌표 사용.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();

    // ── Matter.js 엔진/월드 ─────────────────────────────────────────────────
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;
    const Composite = Matter.Composite;

    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0015 },
      // 안정적 적층을 위해 positionIterations 증가
      positionIterations: 8,
      velocityIterations: 6,
    });
    const world = engine.world;

    // ── 바닥 + 양쪽 벽 ──────────────────────────────────────────────────────
    // 두꺼운 정적 body — 끝 부분에 위치, 텍스트가 넘어가지 않게.
    function buildBounds() {
      // 기존 바닥/벽 제거 후 재생성 (resize 시).
      const toRemove = Composite.allBodies(world).filter((b) => b.label === 'bound');
      for (const b of toRemove) World.remove(world, b);
      const wallOpts = { isStatic: true, label: 'bound' };
      World.add(world, [
        // 바닥
        Bodies.rectangle(cssW / 2, cssH + 40, cssW * 2, 80, wallOpts),
        // 왼쪽
        Bodies.rectangle(-40, cssH / 2, 80, cssH * 3, wallOpts),
        // 오른쪽
        Bodies.rectangle(cssW + 40, cssH / 2, 80, cssH * 3, wallOpts),
        // 천장 — 안 만들면 위로 던질 때 무한 비행. 천장은 화면 위쪽 멀리 두기.
        Bodies.rectangle(cssW / 2, -800, cssW * 2, 80, wallOpts),
      ]);
    }
    buildBounds();

    // ── 마우스 드래그 ───────────────────────────────────────────────────────
    const mouse = Mouse.create(canvas);
    // Mouse는 기본적으로 wheel 이벤트 listen하지 않음, 페이지 스크롤은 정상.
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.18,
        damping: 0.15,
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);

    // 마우스 hover 시 커서 모양 변경 (텍스트 위에 있으면 grab)
    canvas.addEventListener('pointerdown', () => {
      if (mouseConstraint.body) canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('pointerup', () => {
      canvas.style.cursor = 'grab';
    });
    canvas.style.cursor = 'grab';

    // ── 단어 생성 ────────────────────────────────────────────────────────────
    const words: WordBody[] = [];

    // 반응형 스케일 — WORDS의 size는 데스크탑 기준(REF_WIDTH).
    // 폭에 비례해 모바일/태블릿/데스크탑 자동 조정. floor/ceiling으로 극단 화면 보호.
    const REF_WIDTH = 1400;
    const sizeScale = clamp(cssW / REF_WIDTH, 0.4, 1.15);

    /** 텍스트 폭 측정 — fillText 전에 한 번. */
    function measureWidth(text: string, size: number): number {
      if (!ctx) return 0;
      ctx.font = `900 ${size}px ${FONT_FAMILY}`;
      return ctx.measureText(text).width;
    }

    function spawnWord(spec: WordSpec) {
      // 폰트 크기를 뷰포트 비율로 스케일.
      const size = spec.size * sizeScale;
      const w = measureWidth(spec.text, size);
      // 시각적 글자 높이는 폰트 size의 ~70% (cap-height + 약간 여유).
      // body 충돌 box는 약간 더 키워서(0.8) 글자 위아래 여백 흡수.
      const h = size * 0.8;
      const body = Bodies.rectangle(
        // 가로 화면 안에서 무작위 위치, 끝쪽은 제외
        Math.random() * (cssW * 0.85) + cssW * 0.075,
        // 화면 위쪽 바깥에서 떨어뜨림
        -h - Math.random() * 200,
        w,
        h,
        {
          restitution: 0.08, // 약한 튕김
          friction: 0.55,
          frictionAir: 0.012,
          density: 0.001 + size * 0.00002, // 크면 약간 더 무거움
        },
      );
      // 초기 회전 살짝 무작위 — 자연스러운 흩날림
      Body.setAngle(body, (Math.random() - 0.5) * 0.6);
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      World.add(world, body);
      // 스케일된 size를 저장 — render는 이 size로 fillText 호출.
      words.push({ body, text: spec.text, size, w, h });
    }

    // 셔플 후 차례로 떨어뜨림 (220ms 간격, 15개 ≈ 3.3초)
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    let spawnIdx = 0;
    const spawnInterval = window.setInterval(() => {
      if (spawnIdx >= shuffled.length) {
        window.clearInterval(spawnInterval);
        return;
      }
      spawnWord(shuffled[spawnIdx]!);
      spawnIdx++;
    }, 220);

    // ── ResizeObserver ──────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      resizeCanvas();
      buildBounds();
    });
    ro.observe(container);

    // ── 렌더 루프 ────────────────────────────────────────────────────────────
    let rafId = 0;
    let prev = performance.now();
    function tick(now: number) {
      const dt = Math.min(32, now - prev); // ms, cap
      prev = now;
      Engine.update(engine, dt);

      if (!ctx) return;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#0a0e1a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const w of words) {
        ctx.save();
        ctx.translate(w.body.position.x, w.body.position.y);
        ctx.rotate(w.body.angle);
        ctx.font = `900 ${w.size}px ${FONT_FAMILY}`;
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.clearInterval(spawnInterval);
      ro.disconnect();
      World.clear(world, false);
      Engine.clear(engine);
      // Matter.Mouse는 명시적 unregister API 없음. 캔버스 destroy로 충분.
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 bg-white">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
