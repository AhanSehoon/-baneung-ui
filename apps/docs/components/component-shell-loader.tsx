'use client';

import { ComponentShell } from '@/components/component-shell';
import { findComponent } from '@/lib/components';

/**
 * ComponentShellLoader — 클라이언트 사이드에서 registry 조회 후 ComponentShell 렌더.
 *
 * 서버 컴포넌트가 registry 모듈을 임포트하면 일부 컴포넌트의 React.createContext 모듈-탑레벨 호출로
 * 빌드가 실패합니다. slug만 받아 클라이언트에서 lookup하는 얇은 래퍼.
 */
export function ComponentShellLoader({ slug }: { slug: string }) {
  const spec = findComponent(slug);
  if (!spec) {
    return null;
  }
  return <ComponentShell spec={spec} />;
}
