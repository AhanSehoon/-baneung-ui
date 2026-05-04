import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import { checkA11y } from '../../test-utils/axe';

describe('Carousel', () => {
  it('renders region with carousel role description', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
          <CarouselItem>2</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('items have slide role-description', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
          <CarouselItem>2</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    const groups = screen.getAllByRole('group');
    expect(groups[0]).toHaveAttribute('aria-roledescription', 'slide');
  });

  it('renders Previous/Next buttons with aria-label', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    expect(screen.getByRole('button', { name: '이전 슬라이드' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 슬라이드' })).toBeInTheDocument();
  });

  it('Carousel region is keyboard-focusable', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    const region = screen.getByRole('region');
    region.focus();
    expect(region).toHaveFocus();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>슬라이드 1</CarouselItem>
          <CarouselItem>슬라이드 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
