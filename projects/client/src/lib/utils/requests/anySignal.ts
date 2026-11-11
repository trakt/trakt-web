function linkSignals(signals: ReadonlyArray<AbortSignal>): AbortSignal {
  const aborted = signals.find((signal) => signal.aborted);
  if (aborted) return AbortSignal.abort(aborted.reason);

  const controller = new AbortController();

  signals.forEach((signal) =>
    signal.addEventListener('abort', () => controller.abort(signal.reason), {
      once: true,
      signal: controller.signal,
    }),
  );

  return controller.signal;
}

export function anySignal(signals: ReadonlyArray<AbortSignal>): AbortSignal {
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([...signals]);
  }

  return linkSignals(signals);
}
