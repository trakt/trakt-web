import { m } from '$lib/features/i18n/messages.ts';

const MAX_LEVEL = 5;

export function threatMarkup(level: number) {
  const cells = Array.from(
    { length: MAX_LEVEL },
    (_, index) => `<i${index < level ? ' class="is-armed"' : ''}></i>`,
  ).join('');
  return `<span class="doom-threat-cells">${cells}</span><span class="doom-threat-level">${m.text_topic_doom_threat_level({ level })}</span>`;
}
