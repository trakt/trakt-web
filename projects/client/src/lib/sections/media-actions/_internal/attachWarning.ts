/**
 * TODO: improve with a pretty dialog later
 */
export function attachWarning(handler: () => void, message: string) {
  return () =>
    // skipcq: JS-0052
    confirm(
      message,
    ) && handler();
}
