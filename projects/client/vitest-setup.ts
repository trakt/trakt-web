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
import './test/mocks/state.mock.ts';
import './test/mocks/variables.mock.ts';

// jsdom does not implement Blob.prototype.arrayBuffer
// (used by file-based parsers before passing the buffer to mocked unzipSync)
if (!Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function () {
    return Promise.resolve(new ArrayBuffer(0));
  };
}

import { setAuthorization } from '$test/beds/store/renderStore.ts';
import process from 'node:process';
import { afterAll, afterEach, vi } from 'vitest';
import { lazyServer } from './test/mocks/lazyServer.ts';

process.env.TZ = 'UTC';

const mockServer = lazyServer({
  loadServer: () => import('./src/mocks/server.ts').then((m) => m.server),
});

afterEach(async () => {
  vi.clearAllMocks();
  await mockServer.reset();
  setAuthorization(false);
});
afterAll(() => mockServer.close());
