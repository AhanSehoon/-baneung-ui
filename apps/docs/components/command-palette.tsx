'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Command, Dialog, DialogContent, DialogDescription, DialogTitle } from '@baneung-pack/ui';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { value: '/', label: '소개', group: '페이지' },
  { value: '/tokens', label: '디자인 토큰', group: '페이지' },
  { value: '/components', label: '컴포넌트', group: '페이지' },
  { value: '/accessibility', label: '접근성', group: '페이지' },
];

const componentItems = [
  'Button',
  'Input',
  'Field',
  'Select',
  'Combobox',
  'Calendar',
  'Card',
  'Tabs',
  'Pagination',
  'Dialog',
  'Drawer',
  'Toast',
  'DataTable',
  'Carousel',
].map((name) => ({ value: `/components#${name.toLowerCase()}`, label: name, group: '컴포넌트' }));

/**
 * CommandPalette — ⌘K로 열리는 전역 검색 + 네비.
 *
 * Dialog 안에 Command를 합성. 항목 선택 시 router.push.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">명령 팔레트</DialogTitle>
        <DialogDescription className="sr-only">검색하거나 페이지/컴포넌트로 이동</DialogDescription>
        <Command label="명령 팔레트">
          <Command.Input placeholder="명령 또는 페이지 검색…" />
          <Command.List>
            <Command.Empty>결과 없음</Command.Empty>
            <Command.Group heading="페이지">
              {navItems.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.value}
                  keywords={[item.label]}
                  onSelect={() => handleSelect(item.value)}
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="컴포넌트">
              {componentItems.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.value}
                  keywords={[item.label]}
                  onSelect={() => handleSelect(item.value)}
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
