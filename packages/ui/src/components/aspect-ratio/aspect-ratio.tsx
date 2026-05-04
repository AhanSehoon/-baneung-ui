import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

/**
 * AspectRatio — 자식 요소를 지정한 비율(`ratio`)로 고정.
 * Radix Primitive 그대로 re-export — 스타일을 가지지 않는 레이아웃 헬퍼.
 *
 * @example
 *   <AspectRatio ratio={16 / 9}>
 *     <img src="..." alt="..." className="size-full object-cover" />
 *   </AspectRatio>
 */
export const AspectRatio = AspectRatioPrimitive.Root;

export type AspectRatioProps = React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>;
