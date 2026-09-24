type ServerTimingEntry = {
  name: string;
  duration: number;
};

type ServerTiming = {
  measure: <T>(name: string, work: () => Promise<T>) => Promise<T>;
  toHeader: () => string;
};

export function createServerTiming(
  now: () => number = () => performance.now(),
): ServerTiming {
  const entries: ServerTimingEntry[] = [];

  const measure = async <T>(name: string, work: () => Promise<T>) => {
    const start = now();

    try {
      return await work();
    } finally {
      entries.push({ name, duration: now() - start });
    }
  };

  const toHeader = () =>
    entries
      .map(({ name, duration }) => `${name};dur=${duration.toFixed(1)}`)
      .join(', ');

  return { measure, toHeader };
}
