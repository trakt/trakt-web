type HandledErrorInput = {
  error: unknown;
  status: number;
  message: string;
  event: { route: { id: string | null } };
};

type HandledErrorContext = {
  route: string | null;
  status: number;
  message: string;
  valueType: string;
  constructorName: string | null;
  ownKeys: ReadonlyArray<string>;
  hasStack: boolean;
};

function attempt<T>(probe: () => T, fallback: T): T {
  try {
    return probe();
  } catch {
    return fallback;
  }
}

function toConstructorName(value: unknown): string | null {
  if (value === null || typeof value !== 'object') return null;
  return attempt(() => value.constructor?.name ?? null, null);
}

function toOwnKeys(value: unknown): ReadonlyArray<string> {
  if (value === null || typeof value !== 'object') return [];
  return attempt(() => Object.getOwnPropertyNames(value).slice(0, 10), []);
}

export function toHandledErrorContext({
  error,
  status,
  message,
  event,
}: HandledErrorInput): HandledErrorContext {
  return {
    route: event.route.id,
    status,
    message,
    valueType: error === null ? 'null' : typeof error,
    constructorName: toConstructorName(error),
    ownKeys: toOwnKeys(error),
    hasStack: attempt(
      () => error instanceof Error && Boolean(error.stack),
      false,
    ),
  };
}
