import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import * as React from 'react';

import { cn } from '../../lib/cn';

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

interface CarouselContextValue {
  emblaRef: UseEmblaCarouselType[0];
  api: CarouselApi | undefined;
  orientation: 'horizontal' | 'vertical';
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) {
    throw new Error('Carousel 하위 컴포넌트는 <Carousel> 안에서만 사용해야 합니다.');
  }
  return ctx;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  orientation?: 'horizontal' | 'vertical';
  /** API 노출 콜백 (외부 제어용). */
  setApi?: (api: CarouselApi) => void;
}

/**
 * Carousel — embla-carousel-react 기반 슬라이드 컨테이너.
 *
 * - 키보드: ← → (horizontal) / ↑ ↓ (vertical) — Carousel 컴포넌트의 onKeyDown으로 처리
 * - 스와이프: 모바일/터치 자동 지원 (embla)
 * - 자동재생은 `embla-carousel-autoplay` plugin을 별도 추가해 사용
 */
export function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  className,
  children,
  onKeyDown,
  ...props
}: CarouselProps): React.ReactElement {
  const [emblaRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === 'horizontal' ? 'x' : 'y',
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((nextApi: CarouselApi): void => {
    if (!nextApi) return;
    setCanScrollPrev(nextApi.canScrollPrev());
    setCanScrollNext(nextApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!api) return;
    setApi?.(api);
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);
    return (): void => {
      api.off('select', onSelect);
    };
  }, [api, onSelect, setApi]);

  const scrollPrev = React.useCallback((): void => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback((): void => api?.scrollNext(), [api]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === prevKey) {
      scrollPrev();
      event.preventDefault();
    } else if (event.key === nextKey) {
      scrollNext();
      event.preventDefault();
    }
  };

  const value = React.useMemo<CarouselContextValue>(
    () => ({ emblaRef, api, orientation, canScrollPrev, canScrollNext, scrollPrev, scrollNext }),
    [emblaRef, api, orientation, canScrollPrev, canScrollNext, scrollPrev, scrollNext],
  );

  return (
    <CarouselContext.Provider value={value}>
      {/*
        ARIA Carousel 패턴: region을 포커스 가능하게 만들고 화살표 키로 슬라이드 네비.
        jsx-a11y는 일반적으로 non-interactive에 keyboard handler를 막지만, carousel의 경우
        WAI-ARIA Authoring Practices에서 정확히 이 패턴을 권장합니다.
      */}
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        role="region"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          'relative outline-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
        {...props}
      >
        {children}
      </div>
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
    </CarouselContext.Provider>
  );
}

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CarouselContent({ className, ...props }, ref) {
  const { emblaRef, orientation } = useCarousel();
  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CarouselItem({ className, ...props }, ref) {
    const { orientation } = useCarousel();
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'horizontal' ? 'pl-4' : 'pt-4',
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function CarouselPrevious({ className, onClick, ...props }, ref) {
  const { canScrollPrev, scrollPrev } = useCarousel();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="이전 슬라이드"
      disabled={!canScrollPrev}
      onClick={(e): void => {
        scrollPrev();
        onClick?.(e);
      }}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-none',
        'border border-border-default bg-canvas text-foreground',
        'hover:bg-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      ‹
    </button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function CarouselNext({ className, onClick, ...props }, ref) {
  const { canScrollNext, scrollNext } = useCarousel();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="다음 슬라이드"
      disabled={!canScrollNext}
      onClick={(e): void => {
        scrollNext();
        onClick?.(e);
      }}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-none',
        'border border-border-default bg-canvas text-foreground',
        'hover:bg-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      ›
    </button>
  );
});
CarouselNext.displayName = 'CarouselNext';
