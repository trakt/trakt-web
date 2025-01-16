/**
 * TODO: improve with a pretty dialog later
 */
export function attachRemoveWarning(handler: () => void, message: string) {
  return () =>
    confirm(
      message,
    ) && handler();
}
