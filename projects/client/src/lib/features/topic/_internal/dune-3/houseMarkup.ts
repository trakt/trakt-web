import { m } from '$lib/features/i18n/messages.ts';
import { escapeHtml } from '$lib/utils/string/escapeHtml.ts';

type HouseMarkupParams = {
  name: string;
  hours: number | null;
  harvests: number | null;
  seat: string;
};

const CREST = [
  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">',
  '<path d="M20 2.5l15 6v11.5c0 9-6.5 15.2-15 17.5C11.5 35.2 5 29 5 20V8.5z"/>',
  '<path d="M20 6.5l11 4.4v9.1c0 6.8-4.8 11.6-11 13.6-6.2-2-11-6.8-11-13.6v-9.1z" opacity=".45"/>',
  '<circle cx="20" cy="19" r="6.2"/>',
  '<circle cx="20" cy="19" r="2.6" fill="var(--dn3-spice)" stroke="none"/>',
  '<path d="M20 9.5v3M20 25.5v3M10.5 19h3M26.5 19h3" stroke-linecap="round"/>',
  '</svg>',
].join('');

const harvestRecord = (hours: number | null, harvests: number | null) => {
  if (hours) {
    return {
      label: m.text_topic_dune_house_spice_harvested(),
      value: m.text_topic_dune_house_hours({ hours: hours.toLocaleString() }),
    };
  }
  if (harvests) {
    return {
      label: m.text_topic_dune_house_harvests(),
      value: harvests.toLocaleString(),
    };
  }
  return null;
};

export function houseMarkup({
  name,
  hours,
  harvests,
  seat,
}: HouseMarkupParams) {
  const harvest = harvestRecord(hours, harvests);
  return [
    `<span class="dn3-house-crest">${CREST}</span>`,
    '<span class="dn3-house-title">',
    `<i>${m.text_topic_dune_house_record()}</i>`,
    `<b>${escapeHtml(m.text_topic_dune_house_name({ name }))}</b>`,
    '</span>',
    '<span class="dn3-house-records">',
    harvest
      ? `<span><i>${harvest.label}</i><b>${harvest.value}</b></span>`
      : '',
    `<span><i>${m.text_topic_dune_house_seat()}</i><b>${escapeHtml(seat)}</b></span>`,
    '</span>',
  ].join('');
}
