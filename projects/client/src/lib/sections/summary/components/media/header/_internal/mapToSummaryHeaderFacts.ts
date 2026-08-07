import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { isMaxDate } from '$lib/utils/date/isMaxDate.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { toTranslatedStatus } from '$lib/utils/formatting/string/toTranslatedStatus.ts';
import type { MediaSummaryEntry } from '../../models/MediaSummaryEntry.ts';
import type { SummaryHeaderFact } from '../../../header-kit/SummaryHeaderFact.ts';

/**
 * The ruled facts strip (1a) and the single meta line (1b) render the same
 * underlying list, so both read it from here. Facts are data-driven: one the API
 * does not carry is dropped entirely, never rendered as a dash.
 *
 * Order is part of the design contract:
 * year - runtime (films) / episodes (shows) - certification - genre - status.
 */
type FactCandidate = {
  key: string;
  label: string;
  /** `null` marks a fact the API does not carry, which is dropped below. */
  value: string | null;
  inlineValue?: string;
};

function toYear(props: MediaSummaryEntry): string | null {
  if (isMaxDate(props.media.airDate)) {
    return m.tag_text_tba();
  }

  return props.media.year?.toString() ?? null;
}

function toLengthFact(props: MediaSummaryEntry): FactCandidate {
  if (props.type === 'show') {
    const count = props.media.episode.count;

    return {
      key: 'length',
      label: m.list_title_episodes(),
      value: count > 0 ? count.toString() : null,
      inlineValue: m.text_streaming_count_episodes({ count }),
    };
  }

  return {
    key: 'length',
    label: m.header_runtime(),
    value: props.media.runtime > 0
      ? toHumanDuration({ minutes: props.media.runtime }, languageTag())
      : null,
  };
}

function toGenre(props: MediaSummaryEntry): string | null {
  const genre = props.media.genres.at(0);
  return genre ? toTranslatedGenre(genre) : null;
}

export function mapToSummaryHeaderFacts(
  props: MediaSummaryEntry,
): ReadonlyArray<SummaryHeaderFact> {
  const candidates: ReadonlyArray<FactCandidate> = [
    { key: 'year', label: m.header_year(), value: toYear(props) },
    toLengthFact(props),
    {
      key: 'certification',
      label: m.header_certification(),
      value: props.media.certification ?? null,
    },
    { key: 'genre', label: m.header_genre(), value: toGenre(props) },
    {
      key: 'status',
      label: m.header_status(),
      value: toTranslatedStatus(props.media.status),
    },
  ];

  return candidates
    .filter((fact) => Boolean(fact.value))
    .map(({ key, label, value, inlineValue }) => ({
      key,
      label,
      value: value ?? '',
      inlineValue: inlineValue ?? value ?? '',
    }));
}
