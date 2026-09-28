//https://github.com/testing-library/jest-dom?tab=readme-ov-file#with-vitest
import '@testing-library/jest-dom/vitest';
import './test/mocks/animate.mock.ts';
import './test/mocks/IntersectionObserver.mock.ts';
import './test/mocks/ls.mock.ts';
import './test/mocks/matchMedia.mock.ts';
import './test/mocks/navigator.mock.ts';
import './test/mocks/ResizeObserver.mock.ts';
import './test/mocks/scrollTo.mock.ts';

// jsdom does not implement Blob.prototype.arrayBuffer
// (used by file-based parsers before passing the buffer to mocked unzipSync)
if (!Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function () {
    return Promise.resolve(new ArrayBuffer(0));
  };
}

import { resetEnvironment } from '$test/beds/env/resetEnvironment.ts';
import { setAuthorization } from '$test/beds/store/setAuthorization.ts';
import process from 'node:process';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './src/mocks/server.ts';

process.env.TZ = 'UTC';

vi.mock('$app/navigation', () => import('$test/mocks/navigation.mock.ts'));
vi.mock('$app/state', () => import('$test/mocks/state.mock.ts'));
vi.mock('$env/dynamic/private', () => import('$test/mocks/env.mock.ts'));
vi.mock(
  '$style/scss/variables/index.module.scss',
  () => import('$test/mocks/variables.mock.ts'),
);
vi.mock(import('$lib/features/i18n/messages.ts'), async (importOriginal) => ({
  ...await importOriginal(),
  ...await import('$test/mocks/messages.mock.ts'),
}));
vi.mock('oidc-client-ts', async (importOriginal) => ({
  ...await importOriginal<typeof import('oidc-client-ts')>(),
  ...await import('$test/mocks/oidc-client-ts.mock.ts'),
}));

beforeAll(() => server.listen());
afterEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();
  setAuthorization(false);
});
afterAll(() => {
  server.close();
  resetEnvironment();
});
