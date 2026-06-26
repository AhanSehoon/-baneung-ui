import * as React from 'react';

import type { ConfettiApi } from './types';

/**
 * ConfettiContext — Provider 밖에서 useConfetti 호출 시 명확한 에러.
 */
export const ConfettiContext = React.createContext<ConfettiApi | null>(null);
