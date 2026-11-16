import * as m from '$lib/features/i18n/messages.ts';

export function toPlaysLabel(count: number) {
  return count === 1
    ? m.tag_text_play({ number: count })
    : m.tag_text_plays({ number: count });
}
