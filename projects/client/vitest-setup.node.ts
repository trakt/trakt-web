// Lean setup for specs that run without a DOM (see `vite.config.ts` projects).
import './test/mocks/env.mock.ts';
import './test/mocks/messages.mock.ts';
import './test/mocks/variables.mock.ts';

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
});
afterAll(() => mockServer.close());
