import { vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
  env: new Proxy({}, {
    get: (_, variableName) => `${String(variableName)}-MOCK`,
  }),
}));
