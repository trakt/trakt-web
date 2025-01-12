import { vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
  env: new Proxy({}, {
    get: (_, variableName) => {
      if (variableName === 'TRAKT_SESSION_SECRET') {
        return '4GUhCZ+XJ/NT4PXznxWEHuvzi8qsHWreVTfDLTanXIU=';
      }

      return `${String(variableName)}-MOCK`;
    },
  }),
}));
