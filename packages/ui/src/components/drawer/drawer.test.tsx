import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from './drawer';
import { checkA11y } from '../../test-utils/axe';

describe('Drawer', () => {
  it('renders trigger when closed', () => {
    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>제목</DrawerTitle>
          <DrawerDescription>설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.getByText('열기')).toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>제목</DrawerTitle>
          <DrawerDescription>설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByText('제목')).toBeInTheDocument();
  });

  it('controlled `open` prop renders content', async () => {
    render(
      <Drawer open>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>제목</DrawerTitle>
          <DrawerDescription>설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    expect(await screen.findByText('제목')).toBeInTheDocument();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>제목</DrawerTitle>
          <DrawerDescription>설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
