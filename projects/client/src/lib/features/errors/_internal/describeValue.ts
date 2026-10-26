type ValueDescription = {
  valueType: string;
  constructorName: string | null;
  ownKeys: ReadonlyArray<string>;
  hasStack: boolean;
  stack: string | null;
};

const STACK_LINE_LIMIT = 12;

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

function toStack(value: unknown): string | null {
  if (!(value instanceof Error) || !value.stack) return null;
  return value.stack.split('\n').slice(0, STACK_LINE_LIMIT).join('\n');
}

export function describeValue(value: unknown): ValueDescription {
  const stack = attempt(() => toStack(value), null);

  return {
    valueType: value === null ? 'null' : typeof value,
    constructorName: toConstructorName(value),
    ownKeys: toOwnKeys(value),
    hasStack: stack !== null,
    stack,
  };
}
