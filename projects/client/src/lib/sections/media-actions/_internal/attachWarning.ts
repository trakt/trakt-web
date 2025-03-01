/**
 * TODO: improve with a pretty dialog later
 */
export function attachWarning(handler: () => void, message: string) {
  return () =>
    confirm(
      message,
    ) && handler();
}
