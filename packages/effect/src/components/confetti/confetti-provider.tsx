import * as React from 'react';
import { createPortal } from 'react-dom';

import { ConfettiContext } from './confetti-context';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { ConfettiApi, ConfettiFireOptions, ConfettiProviderProps } from './types';

const DEFAULT_COLORS = [
  '#FF3D8E',
  '#3D5BFF',
  '#A6F537',
  '#FFB23D',
  '#D63DFF',
  '#3DECFF',
  '#5BA8A0',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'square' | 'circle' | 'ribbon';
  ticksRemaining: number;
  initialTicks: number;
  /** 입자별 중력 — fire() 옵션을 입자에 저장해 한 캔버스에 다른 옵션 발사 혼합 가능. */
  gravityAcc: number;
}

/**
 * ConfettiProvider — 한 번 마운트해 어디서든 confetti.fire() 호출.
 *
 * # 구현
 * - 전체 화면 fixed `<canvas>` (`pointer-events: none`) Portal.
 * - 발사 시 입자 N개 생성 → requestAnimationFrame 루프로 시뮬레이션.
 * - 입자가 0개면 rAF 정지 → CPU 0%. 다시 fire 호출되면 재개.
 *
 * # a11y
 * - 데코라티브 효과 — `aria-hidden`.
 * - `prefers-reduced-motion: reduce` 시 발사 자체를 무시 (입자 안 만듦).
 *
 * # 발사 위치
 * - HTMLElement 전달 시 그 요소의 화면 중심에서 발사 (버튼 클릭 위치 추적에 좋음).
 * - {x, y} 픽셀, {ratioX, ratioY} 비율, 또는 미지정(가운데 하단).
 */
export function ConfettiProvider({ children, zIndex = 2147483647 }: ConfettiProviderProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const rafIdRef = React.useRef<number | null>(null);

  React.useEffect(() => setMounted(true), []);

  // Canvas DPR + resize 동기화.
  React.useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [mounted]);

  // 입자 시뮬레이션 루프 — 입자 있을 때만 동작.
  const startLoop = React.useCallback(() => {
    if (rafIdRef.current !== null) return; // 이미 실행 중
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function tick() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particlesRef.current;
      // 살아있는 입자만 유지.
      const alive: Particle[] = [];
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        // 중력은 fire() 시 입자에 저장 — vy를 매 frame 누적.
        p.vy += p.gravityAcc;
        // 공기저항으로 vx 감쇠.
        p.vx *= 0.992;
        p.rotation += p.rotationSpeed;
        p.ticksRemaining -= 1;

        // 페이드아웃 — 수명의 마지막 30%에 opacity 감소.
        const lifeRatio = p.ticksRemaining / p.initialTicks;
        const opacity = lifeRatio < 0.3 ? Math.max(0, lifeRatio / 0.3) : 1;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();

        // 살아있고 화면 안에 있으면 유지.
        if (p.ticksRemaining > 0 && p.y < window.innerHeight + 50) {
          alive.push(p);
        }
      }
      particlesRef.current = alive;

      if (alive.length > 0) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        // 입자 0 → loop 정지 (CPU 0%).
        rafIdRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  // fire() 구현.
  const fire = React.useCallback(
    (options?: ConfettiFireOptions) => {
      if (reduced) return; // 모션 줄임 — 무시
      const {
        particleCount = 80,
        colors = DEFAULT_COLORS,
        shape = 'square',
        spread = 60,
        angle = 90, // 위
        velocity = 14,
        gravity = 0.5,
        ticks = 130,
        size = 10,
        origin,
      } = options ?? {};

      // 발사 위치 계산.
      let ox: number, oy: number;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (!origin) {
        ox = vw / 2;
        oy = vh - 40;
      } else if (origin instanceof HTMLElement) {
        const r = origin.getBoundingClientRect();
        ox = r.left + r.width / 2;
        oy = r.top + r.height / 2;
      } else if ('ratioX' in origin) {
        ox = origin.ratioX * vw;
        oy = origin.ratioY * vh;
      } else {
        ox = origin.x;
        oy = origin.y;
      }

      // 입자 N개 생성.
      const angleRad = (angle * Math.PI) / 180;
      const spreadRad = (spread * Math.PI) / 180;
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        // 발사 각도 ± spread/2 사이에서 무작위.
        const a = angleRad + (Math.random() - 0.5) * spreadRad;
        // 속도도 50%~100% 무작위 — 자연스러운 분포.
        const v = velocity * (0.5 + Math.random() * 0.5);
        const vx = Math.cos(a) * v;
        // canvas y축은 아래가 +. 90도가 위라는 건 화면상 위쪽 = 음의 vy.
        const vy = -Math.sin(a) * v;
        const color = colors[Math.floor(Math.random() * colors.length)] ?? '#FFFFFF';
        newParticles.push({
          x: ox,
          y: oy,
          vx,
          vy,
          color,
          size: size * (0.7 + Math.random() * 0.6),
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          shape,
          ticksRemaining: ticks,
          initialTicks: ticks,
          gravityAcc: gravity,
        });
      }
      particlesRef.current.push(...newParticles);
      startLoop();
    },
    [reduced, startLoop],
  );

  const api = React.useMemo<ConfettiApi>(() => ({ fire }), [fire]);

  // cleanup rAF on unmount.
  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <ConfettiContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex,
            }}
          />,
          document.body,
        )}
    </ConfettiContext.Provider>
  );
}
