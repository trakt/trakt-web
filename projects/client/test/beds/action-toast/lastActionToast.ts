import type { ActionToast } from '$lib/features/action-toast/models/ActionToast.ts';
import type { Mock } from 'vitest';

export function lastActionToast(
  notify: Mock,
): Omit<ActionToast, 'id'> | undefined {
  return notify.mock.calls.at(-1)?.at(0);
}
