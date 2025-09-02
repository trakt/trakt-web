//https://github.com/testing-library/jest-dom?tab=readme-ov-file#with-vitest
import '@testing-library/jest-dom/vitest';
import './test/mocks/animate.mock.ts';
import './test/mocks/env.mock.ts';
import './test/mocks/IntersectionObserver.mock.ts';
import './test/mocks/ls.mock.ts';
import './test/mocks/matchMedia.mock.ts';
import './test/mocks/messages.mock.ts';
import './test/mocks/navigation.mock.ts';
import './test/mocks/navigator.mock.ts';
import './test/mocks/oidc-client-ts.mock.ts';
import './test/mocks/ResizeObserver.mock.ts';
import './test/mocks/scrollTo.mock.ts';
import './test/mocks/variables.mock.ts';

import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './src/mocks/server.ts';

process.env.TZ = 'UTC';

beforeAll(() => server.listen());
afterEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();
  setAuthorization(false);
});
afterAll(() => server.close());
