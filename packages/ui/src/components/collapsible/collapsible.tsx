import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

/**
 * Collapsible — Radix Collapsible 기반 단순 fold/unfold 컴포넌트.
 *
 * Accordion보다 가볍고 단일 영역의 보이기/숨기기에 사용합니다.
 *
 * @example
 *   <Collapsible>
 *     <CollapsibleTrigger asChild><Button>{open ? '접기' : '더 보기'}</Button></CollapsibleTrigger>
 *     <CollapsibleContent>...</CollapsibleContent>
 *   </Collapsible>
 */
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = CollapsiblePrimitive.Content;
