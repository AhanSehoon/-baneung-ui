import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { checkA11y } from '../../test-utils/axe';

describe('Table', () => {
  it('renders semantic <table>', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>월</TableHead>
            <TableHead>매출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1월</TableCell>
            <TableCell>1,200,000</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('caption is associated with table', () => {
    render(
      <Table>
        <TableCaption>월간 매출</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>월</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1월</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: '월간 매출' })).toBeInTheDocument();
  });

  it('renders correct number of rows and columns', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>A</TableHead>
            <TableHead>B</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('cell')).toHaveLength(4);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Table>
        <TableCaption>월간 매출</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>월</TableHead>
            <TableHead>매출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1월</TableCell>
            <TableCell>1,200,000</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
