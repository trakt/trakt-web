import { vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
  env: new Proxy({}, {
    get: (_, variableName) => {
      if (variableName === 'TRAKT_SESSION_SECRET') {
        return 'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=';
      }

      return `${String(variableName)}-MOCK`;
    },
  }),
}));
