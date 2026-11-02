import type { RequestEvent } from '@sveltejs/kit';
import { type Mock, vi } from 'vitest';

type Nil = null | undefined;

function serializeCookie(
  name: string,
  value: string,
  options?: Record<string, unknown>,
): string {
  const optionsStr = options
    ? Object.entries(options)
        .map(([key, val]) => `;${key}=${val}`)
        .join('')
    : '';
  return `${name}=${value}${optionsStr}`;
}

class InMemoryCookies {
  private store: Map<string, string> = new Map();

  getAll() {
    return Array.from(this.store.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }

  get(name: string): string | null {
    return this.store.get(name) ?? null;
  }

  set(name: string, value: string, _options: Record<string, unknown>): void {
    this.store.set(name, value);
  }

  delete(name: string): void {
    this.store.delete(name);
  }
}

type MockFunction<T> = T & Mock;
type MockRequestEvent<
  T extends Record<string, string> = Record<string, string>,
> = Exclude<RequestEvent<T>, 'cookies'> & {
  cookies: {
    get: MockFunction<(name: string) => string | null>;
    set: MockFunction<
      (name: string, value: string, options: Record<string, unknown>) => string
    >;
    serialize: MockFunction<
      (name: string, value: string, options: Record<string, unknown>) => string
    >;
  };
};

type RequestEventProps = {
  url: string;
  request?: Request;
  cookieHandler?: (key: string) => string | Nil;
  routeId?: string | null;
};

export function mockRequestEvent({
  url,
  request = new Request('http://localhost'),
  cookieHandler,
  routeId = null,
}: RequestEventProps): MockRequestEvent {
  const cookies = new InMemoryCookies();

  return {
    url: new URL(url),
    cookies: {
      getAll: vi.fn(() => cookies.getAll()),
      get: vi.fn((name: string) => cookieHandler?.(name) ?? cookies.get(name)),
      set: vi.fn(
        (name: string, value: string, options: Record<string, unknown>) =>
          cookies.set(name, value, options),
      ),
      delete: vi.fn((name: string) => cookies.delete(name)),
      serialize: vi.fn(
        (name: string, value: string, options: Record<string, unknown>) =>
          serializeCookie(name, value, options),
      ),
    },
    locals: {},
    request,
    route: { id: routeId },
  } as unknown as MockRequestEvent;
}
