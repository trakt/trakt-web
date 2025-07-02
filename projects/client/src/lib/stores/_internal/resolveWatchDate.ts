import * as m from '$lib/features/i18n/messages.ts';
import type { WatchAction } from '@trakt/api';

export function resolveWatchDate(
  action: WatchAction | undefined,
) {
  const now = new Date().toISOString();

  switch (action) {
    case 'released':
      return 'released';
    case 'ask':
      return prompt(
        m.input_prompt_mark_as_watched_date(),
        now,
      ) ?? undefined;
    case 'now':
    default:
      return now;
  }
}
