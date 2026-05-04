import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { checkA11y } from '../../test-utils/axe';

describe('HoverCard', () => {
  it('does not render content when closed', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>호버</HoverCardTrigger>
        <HoverCardContent>카드 내용</HoverCardContent>
      </HoverCard>,
    );
    expect(screen.queryByText('카드 내용')).not.toBeInTheDocument();
  });

  it('renders trigger', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>@username</HoverCardTrigger>
        <HoverCardContent>유저 정보</HoverCardContent>
      </HoverCard>,
    );
    expect(screen.getByText('@username')).toBeInTheDocument();
  });

  it('opens via controlled open prop', async () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>호버</HoverCardTrigger>
        <HoverCardContent>카드 내용</HoverCardContent>
      </HoverCard>,
    );
    expect(await screen.findByText('카드 내용')).toBeInTheDocument();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>호버</HoverCardTrigger>
        <HoverCardContent>카드 내용</HoverCardContent>
      </HoverCard>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
