import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { GenreFilter } from '$lib/features/filters/models/GenreFilter.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { type Genre, genreOptionSchema } from '@trakt/api';
import { getContext, setContext } from 'svelte';
import { derived, type Writable, writable } from 'svelte/store';

const FILTER_CONTEXT_KEY = Symbol('filter');

type FilterContextData = Writable<GenreFilter>;

export function useFilter() {
  const { track } = useTrack(AnalyticsEvent.Filter);

  const filter = getContext<FilterContextData>(FILTER_CONTEXT_KEY) ??
    setContext<FilterContextData>(
      FILTER_CONTEXT_KEY,
      writable({
        key: 'genres',
        options: genreOptionSchema.options
          .map((genre) => ({
            label: toTranslatedValue('genre', genre),
            value: genre,
          }))
          .sort((a, b) => a.label.localeCompare(b.label, languageTag())),
        value: null,
      }),
    );

  return {
    filter: derived(filter, ($filter) =>
      assertDefined(
        $filter,
        'Filter has not been initialized',
      )),
    setFilter: (value: Genre | null) => {
      filter.update((current) => {
        track({ id: current.key, action: value ? 'set' : 'reset' });
        return {
          ...current,
          value,
        };
      });
    },
    filterMap: derived(filter, ($filter) => {
      if (!$filter?.value) {
        return {};
      }

      return {
        [$filter.key]: $filter.value,
      };
    }),
  };
}
