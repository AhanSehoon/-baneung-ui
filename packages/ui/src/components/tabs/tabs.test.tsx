import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { checkA11y } from '../../test-utils/axe';

describe('Tabs', () => {
  it('renders horizontal tablist with triggers', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  it('clicking a tab activates it', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>,
    );
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });

  it('arrow keys navigate horizontally', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
          <TabsTrigger value="c">C</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
        <TabsContent value="c">C</TabsContent>
      </Tabs>,
    );
    const a = screen.getByRole('tab', { name: 'A' });
    a.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
  });

  it('vertical orientation uses up/down arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <Tabs orientation="vertical" defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
      </Tabs>,
    );
    const a = screen.getByRole('tab', { name: 'A' });
    a.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveFocus();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">개요</TabsTrigger>
          <TabsTrigger value="b">상세</TabsTrigger>
        </TabsList>
        <TabsContent value="a">개요 본문</TabsContent>
        <TabsContent value="b">상세 본문</TabsContent>
      </Tabs>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
