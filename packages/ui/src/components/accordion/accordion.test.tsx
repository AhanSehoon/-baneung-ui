import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { checkA11y } from '../../test-utils/axe';

describe('Accordion', () => {
  it('renders triggers without content visible initially', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>섹션 A</AccordionTrigger>
          <AccordionContent>본문 A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: /섹션 A/ })).toBeInTheDocument();
  });

  it('expands on trigger click (single mode)', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>본문 A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>본문 B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(await screen.findByText('본문 A')).toBeInTheDocument();
  });

  it('single mode closes others when one opens', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>본문 A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>본문 B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode keeps multiple open', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>본문 A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>본문 B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="faq1">
          <AccordionTrigger>자주 묻는 질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
