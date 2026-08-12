import { isCancelledError } from '@tanstack/query-core';

export function rethrowUnlessCancelled(error: unknown): void {
  if (isCancelledError(error)) {
    return;
  }

  throw error;
}
