import { EXCLUSION_PREFIX } from '$lib/features/filters/exclusionPrefix.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';
import { toTitleCaseSlug } from '$lib/utils/formatting/string/toTitleCaseSlug.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { toTranslatedStatus } from '$lib/utils/formatting/string/toTranslatedStatus.ts';
import { toTranslatedSubgenre } from '$lib/utils/formatting/string/toTranslatedSubgenre.ts';
import type { SmartListAwardLabel } from './models/SmartListAwardLabel.ts';
import type { SmartListRecipe } from './models/SmartListRecipe.ts';
import { toSmartListFilterLabel } from './toSmartListFilterLabel.ts';
import { toSmartListMediaTypeLabel } from './toSmartListMediaTypeLabel.ts';
import { toSmartListSourceLabel } from './toSmartListSourceLabel.ts';

type ListKey =
  | 'genres'
  | 'subgenres'
  | 'keywords'
  | 'people'
  | 'studios'
  | 'awards'
  | 'networks'
  | 'languages'
  | 'countries'
  | 'certifications'
  | 'statuses'
  | 'watchnow';

type IncludeRow = {
  key: ListKey;
  label: () => string;
  format: (value: string) => string;
  operator?: 'genres_operator' | 'keywords_operator' | 'people_operator';
};

const INCLUDE_ROWS: ReadonlyArray<IncludeRow> = [
  {
    key: 'genres',
    label: m.header_genre,
    format: (genre) => toTranslatedGenre(genre),
    operator: 'genres_operator',
  },
  {
    key: 'subgenres',
    label: m.header_smart_list_subgenres,
    format: toTranslatedSubgenre,
  },
  {
    key: 'keywords',
    label: m.header_smart_list_keywords,
    format: toTitleCaseSlug,
    operator: 'keywords_operator',
  },
  {
    key: 'people',
    label: m.header_smart_list_people,
    format: toTitleCaseSlug,
    operator: 'people_operator',
  },
  {
    key: 'studios',
    label: m.header_smart_list_studios,
    format: toTitleCaseSlug,
  },
  {
    key: 'awards',
    label: m.header_smart_list_awards,
    format: toTitleCaseSlug,
  },
  {
    key: 'networks',
    label: m.header_smart_list_networks,
    format: toTitleCaseSlug,
  },
  {
    key: 'languages',
    label: m.header_smart_list_languages,
    format: (code) => toLanguageName(code, languageTag()),
  },
  {
    key: 'countries',
    label: m.header_country,
    format: (code) => toCountryName(code.toUpperCase(), languageTag()),
  },
  {
    key: 'certifications',
    label: m.header_certification,
    format: (value) => value.toUpperCase(),
  },
  {
    key: 'statuses',
    label: m.header_status,
    format: (status) => toTranslatedStatus(status),
  },
  {
    key: 'watchnow',
    label: m.header_streaming,
    format: toTitleCaseSlug,
  },
];

const LIMIT_KEYS: ReadonlyArray<keyof SmartListFilters> = [
  'years',
  'released_within_days',
  'runtimes',
  'ratings',
  'votes',
  'imdb_ratings',
  'imdb_votes',
  'tmdb_ratings',
  'rt_meters',
  'rt_user_meters',
  'letterboxd_ratings',
  'mal_ratings',
  'metascores',
  'parental_nudity',
  'parental_violence',
  'parental_profanity',
  'parental_alcohol',
  'parental_frightening',
];

const HIDE_TOGGLES: ReadonlyArray<{
  key: keyof SmartListFilters;
  label: () => string;
}> = [
  { key: 'ignore_watched', label: m.tag_text_watched },
  { key: 'ignore_watchlisted', label: m.tag_text_watchlisted },
  { key: 'ignore_watching', label: m.toggle_text_hide_watching },
  { key: 'ignore_unreleased', label: m.toggle_text_hide_unreleased },
  { key: 'ignore_released', label: m.toggle_text_hide_released },
  { key: 'ignore_ended', label: m.toggle_text_hide_ended },
  { key: 'ignore_airing', label: m.toggle_text_hide_airing },
  {
    key: 'ignore_no_release_date',
    label: m.toggle_text_hide_no_release_date,
  },
];

const ROLE_LABELS: Record<
  NonNullable<SmartListFilters['people_role']>,
  () => string
> = {
  any: m.option_text_role_any,
  cast: m.option_text_role_cast,
  directing: m.option_text_role_directing,
  writing: m.option_text_role_writing,
  producing: m.option_text_role_producing,
};

function toValue(format: IncludeRow['format'], raw: string) {
  const isExcluded = raw.startsWith(EXCLUSION_PREFIX);
  const value = isExcluded ? raw.slice(EXCLUSION_PREFIX.length) : raw;

  return { key: raw, label: format(value), isExcluded };
}

function toDetail(label: string, value: string) {
  return m.text_smart_list_recipe_detail({ label, value });
}

function toOperatorDetails(
  row: IncludeRow,
  { filters, included }: { filters: SmartListFilters; included: number },
): string[] {
  if (!row.operator || included < 2) {
    return [];
  }

  const value =
    filters[row.operator] === 'and'
      ? m.option_text_match_all()
      : m.option_text_match_any();

  return [toDetail(m.label_smart_list_match(), value)];
}

function toAwardDetails(filters: SmartListFilters): string[] {
  const [min, max] = filters.award_years ?? [];
  const years =
    min != null && max != null
      ? [
          toDetail(
            m.label_smart_list_ceremony_year(),
            m.list_summary_range_between({
              min: String(min),
              max: String(max),
            }),
          ),
        ]
      : [];

  return filters.award_won
    ? [m.toggle_text_award_winners_only(), ...years]
    : years;
}

function toRowDetails({
  row,
  filters,
  values,
}: {
  row: IncludeRow;
  filters: SmartListFilters;
  values: ReadonlyArray<string>;
}) {
  const included = values.filter(
    (value) => !value.startsWith(EXCLUSION_PREFIX),
  ).length;
  const operator = toOperatorDetails(row, { filters, included });

  if (row.key === 'people' && filters.people_role) {
    return [
      ...operator,
      toDetail(
        m.label_smart_list_people_role(),
        ROLE_LABELS[filters.people_role](),
      ),
    ];
  }

  if (row.key === 'watchnow' && filters.watchnow_country) {
    return [
      ...operator,
      toDetail(
        m.header_country(),
        toCountryName(filters.watchnow_country.toUpperCase(), languageTag()),
      ),
    ];
  }

  return operator;
}

type AwardGroup = {
  key: string;
  label: string;
  values: ReadonlyArray<string>;
};

function toAwardGroups({
  row,
  values,
  awardLabels,
}: {
  row: IncludeRow;
  values: ReadonlyArray<string>;
  awardLabels: ReadonlyMap<string, SmartListAwardLabel>;
}): ReadonlyArray<AwardGroup> {
  return values.reduce<ReadonlyArray<AwardGroup>>((groups, raw) => {
    const label = awardLabels.get(raw);
    const key = label ? `${row.key}:${label.ceremonySlug}` : row.key;
    const existing = groups.find((group) => group.key === key);

    if (existing) {
      return groups.map((group) =>
        group === existing
          ? { ...group, values: [...group.values, raw] }
          : group,
      );
    }

    return [
      ...groups,
      { key, label: label?.ceremony ?? row.label(), values: [raw] },
    ];
  }, []);
}

function toAwardRows({
  row,
  filters,
  awardLabels,
}: {
  row: IncludeRow;
  filters: SmartListFilters;
  awardLabels: ReadonlyMap<string, SmartListAwardLabel>;
}) {
  const values = dedupe((raw) => raw, filters.awards ?? []);
  const groups = toAwardGroups({ row, values, awardLabels });
  const format = (raw: string) =>
    awardLabels.get(raw)?.shortName ?? row.format(raw);

  return groups.map((group, index) => ({
    key: group.key,
    label: group.label,
    values: group.values.map((raw) => toValue(format, raw)),
    details: index === groups.length - 1 ? toAwardDetails(filters) : [],
  }));
}

function toIncludes({
  filters,
  awardLabels,
}: {
  filters: SmartListFilters;
  awardLabels: ReadonlyMap<string, SmartListAwardLabel>;
}) {
  return INCLUDE_ROWS.filter(
    (row) => (filters[row.key]?.length ?? 0) > 0,
  ).flatMap((row) => {
    if (row.key === 'awards') {
      return toAwardRows({ row, filters, awardLabels });
    }

    const values = dedupe((raw) => raw, filters[row.key] ?? []);

    return [
      {
        key: row.key,
        label: row.label(),
        values: values.map((raw) => toValue(row.format, raw)),
        details: toRowDetails({ row, filters, values }),
      },
    ];
  });
}

function toLimits(filters: SmartListFilters) {
  const ranges = LIMIT_KEYS.flatMap((key) =>
    toSmartListFilterLabel({ key, value: filters[key] }).map(
      (label, index) => ({
        key: `${key}-${index}`,
        label,
      }),
    ),
  );

  return filters.parental_include_unrated
    ? [
        ...ranges,
        {
          key: 'parental_include_unrated',
          label: m.toggle_text_include_unrated_parental(),
        },
      ]
    : ranges;
}

export function toSmartListRecipe(
  list: Pick<SmartList, 'source' | 'mediaType' | 'filters'>,
  awardLabels: ReadonlyMap<string, SmartListAwardLabel> = new Map(),
): SmartListRecipe {
  return {
    source: toSmartListSourceLabel(list.source),
    mediaType: toSmartListMediaTypeLabel(list.mediaType),
    includes: toIncludes({ filters: list.filters, awardLabels }),
    limits: toLimits(list.filters),
    hidden: HIDE_TOGGLES.filter(({ key }) => list.filters[key] === true).map(
      ({ key, label }) => ({ key, label: label() }),
    ),
  };
}
