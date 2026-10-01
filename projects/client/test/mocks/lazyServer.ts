import type { SetupServer } from 'msw/node';

type MockServer = Pick<SetupServer, 'listen' | 'resetHandlers' | 'close'>;

type LazyServerProps = {
  loadServer: () => Promise<MockServer>;
};

/**
 * Defers loading the MSW server (and every handler + fixture it pulls in)
 * until the first `fetch` call, so specs that never hit the network don't pay
 * for it. Specs that touch the server directly (`server.use`) still work
 * because the first fetch starts listening.
 */
export function lazyServer({ loadServer }: LazyServerProps) {
  const originalFetch = globalThis.fetch;
  const state: { server?: Promise<MockServer> } = {};

  const start = () =>
    state.server ??= loadServer().then((server) => {
      // MSW patches whatever `fetch` is current, so the wrapper must go first.
      globalThis.fetch = originalFetch;
      server.listen();
      return server;
    });

  globalThis.fetch = (...args) => start().then(() => globalThis.fetch(...args));

  return {
    reset: async () => (await state.server)?.resetHandlers(),
    close: async () => (await state.server)?.close(),
  };
}
