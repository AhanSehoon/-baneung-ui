import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@baneung-pack/ui';

export interface ApiProp {
  property: string;
  description: React.ReactNode;
  type: string;
  default?: string;
  version?: string;
}

/**
 * ApiTable — 컴포넌트 props 명세표.
 *
 * 컬럼: Property / Description / Type / Default / Version
 * 모노스페이스 타입과 시각 위계는 토큰 기반.
 */
export function ApiTable({ rows }: { rows: ApiProp[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-foreground-muted">노출 props 없음 (children만 받습니다).</p>;
  }
  const showVersion = rows.some((r) => r.version);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-44">Property</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-72">Type</TableHead>
          <TableHead className="w-32">Default</TableHead>
          {showVersion ? <TableHead className="w-24">Version</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.property}>
            <TableCell>
              <code className="font-mono text-xs text-link">{row.property}</code>
            </TableCell>
            <TableCell className="text-sm">{row.description}</TableCell>
            <TableCell>
              <code className="font-mono text-xs text-foreground-muted whitespace-pre-wrap">
                {row.type}
              </code>
            </TableCell>
            <TableCell>
              {row.default ? (
                <code className="font-mono text-xs text-foreground-muted">{row.default}</code>
              ) : (
                <span className="text-foreground-subtle">—</span>
              )}
            </TableCell>
            {showVersion ? (
              <TableCell>
                {row.version ? (
                  <code className="font-mono text-xs text-foreground-muted">{row.version}</code>
                ) : (
                  <span className="text-foreground-subtle">—</span>
                )}
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
