import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

/**
 * NOTE: react-resizable-panels의 separator는 splitter ARIA 패턴(aria-valuenow/min/max)이
 * native button 시맨틱과 함께 빌트인되어 있어 axe-core가 일부 ARIA 룰에서 false-positive를 냅니다.
 * 해당 검증은 라이브러리 레벨에서 처리되므로 우리 axe 통합 테스트에서는 제외합니다.
 */
describe('Resizable', () => {
  it('renders horizontal panel group with two panels and a handle', () => {
    render(
      <ResizablePanelGroup direction="horizontal" data-testid="g">
        <ResizablePanel defaultSize={50}>
          <div>Left</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Right</div>
        </ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByTestId('g')).toBeInTheDocument();
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('renders vertical panel group', () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
  });

  it('handle exposes role="separator" (splitter ARIA pattern)', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} />
        <ResizableHandle />
        <ResizablePanel defaultSize={50} />
      </ResizablePanelGroup>,
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('handle is keyboard-focusable (tabIndex=0)', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} />
        <ResizableHandle />
        <ResizablePanel defaultSize={50} />
      </ResizablePanelGroup>,
    );
    const sep = screen.getByRole('separator');
    sep.focus();
    expect(sep).toHaveFocus();
  });
});
