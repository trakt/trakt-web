<script module lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SliderRange } from "$lib/components/slider/models/SliderRange.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";

  type RangeKey =
    | "tmdb_ratings"
    | "letterboxd_ratings"
    | "mal_ratings"
    | "metascores";

  type ToggleKey =
    | "ignore_watching"
    | "ignore_unreleased"
    | "ignore_released"
    | "ignore_ended"
    | "ignore_airing"
    | "ignore_no_release_date";

  const VOTE_STEPS: ReadonlyArray<number> = [100, 1_000, 10_000, 100_000];
  const RELEASE_WINDOWS: ReadonlyArray<number> = [30, 90, 180, 365];
  const ANY = "any";
  const BODY_ID = "smart-list-more-filters";

  const RATING_SLIDERS: ReadonlyArray<{
    key: RangeKey;
    label: string;
    range: SliderRange;
    step: number;
    ticks: number;
  }> = [
    {
      key: "tmdb_ratings",
      label: "TMDB",
      range: { min: 0, max: 10 },
      step: 0.5,
      ticks: 6,
    },
    {
      key: "letterboxd_ratings",
      label: "Letterboxd",
      range: { min: 0, max: 5 },
      step: 0.5,
      ticks: 6,
    },
    {
      key: "mal_ratings",
      label: "MAL",
      range: { min: 0, max: 10 },
      step: 0.5,
      ticks: 6,
    },
    {
      key: "metascores",
      label: "Metascore",
      range: { min: 0, max: 100 },
      step: 5,
      ticks: 5,
    },
  ];

  const TOGGLES: ReadonlyArray<{
    key: ToggleKey;
    label: () => string;
  }> = [
    {
      key: "ignore_watching",
      label: m.toggle_text_hide_watching,
    },
    { key: "ignore_unreleased", label: m.toggle_text_hide_unreleased },
    { key: "ignore_released", label: m.toggle_text_hide_released },
    {
      key: "ignore_ended",
      label: m.toggle_text_hide_ended,
    },
    {
      key: "ignore_airing",
      label: m.toggle_text_hide_airing,
    },
    {
      key: "ignore_no_release_date",
      label: m.toggle_text_hide_no_release_date,
    },
  ];

  const VOTES = [
    { key: "votes", source: "Trakt" },
    { key: "imdb_votes", source: "IMDb" },
  ] as const;
</script>

<script lang="ts">
  import CountBadge from "$lib/components/badge/CountBadge.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownCaretIcon from "$lib/components/dropdown/DropdownCaretIcon.svelte";
  import ResetFiltersIcon from "$lib/components/icons/ResetFiltersIcon.svelte";
  import MultiSelect from "$lib/components/select/MultiSelect.svelte";
  import type { MultiSelectSelection } from "$lib/components/select/models/MultiSelectSelection.ts";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import { isFullRange } from "$lib/components/slider/isFullRange.ts";
  import { OPEN_VOTES_CEILING } from "$lib/sections/lists/smart/openVotesCeiling.ts";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { generateCountryOptions } from "$lib/features/filters/generateCountryOptions.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { SmartListFilters } from "$lib/requests/models/SmartListFilters.ts";
  import { smartListLanguagesQuery } from "$lib/requests/queries/smart-lists/smartListLanguagesQuery.ts";
  import FilterSection from "$lib/sections/navbar/components/filter/FilterSection.svelte";
  import Filter from "$lib/sections/navbar/components/filter/filters/Filter.svelte";
  import FilterGroup from "$lib/sections/navbar/components/filter/filters/FilterGroup.svelte";
  import SliderField from "$lib/sections/navbar/components/filter/filters/SliderField.svelte";
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import { withSmartListFilter } from "../withSmartListFilter.ts";
  import type { FilterSettingsSlot } from "$lib/sections/navbar/components/filter/filters/FilterSettingsSlot.ts";
  import { SHOW_ONLY_SMART_LIST_FILTERS } from "../showOnlySmartListFilters.ts";
  import { toSmartListExtrasForType } from "../toSmartListExtrasForType.ts";
  import SearchableFilterSelect from "./SearchableFilterSelect.svelte";
  import SmartListMatchFilter from "./SmartListMatchFilter.svelte";

  type SmartListMoreFiltersProps = {
    filters: SmartListFilters;
    type: DiscoverMode;
    disabled?: boolean;
    onChange: (filters: SmartListFilters) => void;
  };

  type FilterKey = keyof SmartListFilters;

  type MatchKey = "keywords_operator" | "people_operator";

  const {
    filters,
    type,
    disabled = false,
    onChange,
  }: SmartListMoreFiltersProps = $props();

  const languages = useQuery(
    fromRune(() => type).pipe(
      map((type) => smartListLanguagesQuery({ type })),
    ),
  );
  const motionDuration = useMotionDuration();

  const countryOptions = [
    { value: ANY, label: m.option_text_any_country() },
    ...generateCountryOptions().map((option) => ({
      value: option.value,
      label: option.label(),
    })),
  ];

  const roleOptions = [
    { value: ANY, label: m.option_text_role_any() },
    { value: "cast", label: m.option_text_role_cast() },
    { value: "directing", label: m.option_text_role_directing() },
    { value: "writing", label: m.option_text_role_writing() },
    { value: "producing", label: m.option_text_role_producing() },
  ];

  const releaseOptions = [
    { value: ANY, label: m.option_text_any_time() },
    ...RELEASE_WINDOWS.map((days) => ({
      value: String(days),
      label: m.option_text_last_days({ count: String(days) }),
    })),
  ];

  const voteOptions = [
    { value: ANY, label: m.option_text_any_votes() },
    ...VOTE_STEPS.map((votes) => ({
      value: String(votes),
      label: m.option_text_votes_from({
        count: toHumanCount(votes, languageTag()),
      }),
    })),
  ];

  let isOpen = $state(false);

  const hasShows = $derived(type !== "movie");
  const visibleToggles = $derived(
    TOGGLES.filter((toggle) =>
      hasShows || !SHOW_ONLY_SMART_LIST_FILTERS.includes(toggle.key)
    ),
  );
  const activeCount = $derived(
    Object.keys(toSmartListExtrasForType({ filters, type })).filter((key) =>
      key !== "genres_operator"
    ).length,
  );

  const isShown = (...keys: ReadonlyArray<FilterKey>) =>
    isOpen || keys.some((key) => filters[key] != null);

  const reveal = (node: HTMLElement) =>
    slide(node, {
      duration: $motionDuration(time.seconds(0.32)),
      easing: cubicOut,
    });

  const set = <K extends FilterKey>(
    key: K,
    value: SmartListFilters[K] | null,
  ) => onChange(withSmartListFilter({ filters, key, value }));

  const toRange = (key: RangeKey, range: SliderRange) => {
    const full = RATING_SLIDERS.find((slider) => slider.key === key)?.range ??
      range;

    return isFullRange({ value: range, range: full })
      ? null
      : [range.min, range.max];
  };

  const toSliderValue = (key: RangeKey, fallback: SliderRange) => {
    const [min = fallback.min, max = fallback.max] = filters[key] ?? [];
    return { min, max };
  };

  const onLanguagesChange = (selection: MultiSelectSelection) =>
    set("languages", selection.included);
</script>

{#snippet match(key: MatchKey)}
  <SmartListMatchFilter
    value={filters[key]}
    {disabled}
    onChange={(value) => set(key, value)}
  />
{/snippet}

{#snippet searchable(
  key: "keywords" | "people" | "studios" | "networks",
  title: string,
  searchPlaceholder: string,
  settings?: FilterSettingsSlot,
)}
  <Filter {title} variant="inline" {settings}>
    <SearchableFilterSelect
      kind={key}
      values={filters[key] ?? []}
      placeholder={m.option_text_all()}
      {searchPlaceholder}
      {disabled}
      onChange={(values) => set(key, values)}
    />
  </Filter>
{/snippet}

{#snippet keywordSettings()}
  {@render match("keywords_operator")}
{/snippet}

{#snippet peopleSettings()}
  {@render chipSelect({
    title: m.label_smart_list_people_role(),
    options: roleOptions,
    value: filters.people_role,
    onChange: (value) =>
      set("people_role", value as SmartListFilters["people_role"] | null),
  })}
  {@render match("people_operator")}
{/snippet}

{#snippet chipSelect(props: {
  title: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string | Nil;
  onChange: (value: string | null) => void;
})}
  <Filter title={props.title} variant="inline">
    <SingleSelect
      options={props.options}
      value={props.value ?? ANY}
      placeholder={props.title}
      variant="chip"
      autoWidth
      {disabled}
      onChange={(value) => props.onChange(value === ANY ? null : value)}
    />
  </Filter>
{/snippet}

<section
  class="trakt-smart-list-more-filters"
  class:is-open={isOpen}
  class:is-disabled={disabled}
>
  <div class="more-filters-header">
    <button
      type="button"
      class="more-filters-toggle"
      aria-expanded={isOpen}
      aria-controls={BODY_ID}
      onclick={() => (isOpen = !isOpen)}
    >
      <span class="bold">{m.header_smart_list_more_filters()}</span>
      {#if activeCount > 0}
        <CountBadge count={activeCount} label={m.button_label_filters()} />
      {/if}
      <DropdownCaretIcon open={isOpen} />
    </button>

    <Tooltip content={m.tooltip_reset_filters()} variant="compact" side="bottom">
      <ActionButton
        label={m.button_label_reset_smart_list_more_filters()}
        style="ghost"
        color="red"
        tooltip={false}
        disabled={disabled || activeCount === 0}
        onclick={() =>
          onChange(
            withSmartListFilter({
              filters: {},
              key: "genres_operator",
              value: filters.genres_operator ?? null,
            }),
          )}
      >
        <ResetFiltersIcon />
      </ActionButton>
    </Tooltip>
  </div>

  <div class="more-filters-body" id={BODY_ID}>
    {#snippet toggleRow(
      key: ToggleKey | "parental_include_unrated",
      label: string,
    )}
      <Filter title={label} variant="inline">
        <Switch
          {label}
          checked={filters[key] === true}
          {disabled}
          onclick={() => set(key, filters[key] !== true)}
        />
      </Filter>
    {/snippet}

    {#if isShown("keywords", "keywords_operator", "people", "people_role", "people_operator", "studios", "networks", "languages", "watchnow_country")}
      <div transition:reveal>
        <FilterGroup>

          {#if isShown("keywords", "keywords_operator")}
            <div transition:reveal>
              {@render searchable(
                "keywords",
                m.header_smart_list_keywords(),
                m.input_placeholder_search_keywords(),
                {
                  content: keywordSettings,
                  isModified: filters.keywords_operator != null,
                },
              )}
            </div>
          {/if}

          {#if isShown("people", "people_role", "people_operator")}
            <div transition:reveal>
              {@render searchable(
                "people",
                m.header_smart_list_people(),
                m.input_placeholder_search_people(),
                {
                  content: peopleSettings,
                  isModified: filters.people_role != null ||
                    filters.people_operator != null,
                },
              )}
            </div>
          {/if}

          {#if isShown("studios")}
            <div transition:reveal>
              {@render searchable(
                "studios",
                m.header_smart_list_studios(),
                m.input_placeholder_search_studios(),
              )}
            </div>
          {/if}

          {#if hasShows && isShown("networks")}
            <div transition:reveal>
              {@render searchable(
                "networks",
                m.header_smart_list_networks(),
                m.input_placeholder_search_networks(),
              )}
            </div>
          {/if}

          {#if isShown("languages")}
            <div transition:reveal>
              <Filter title={m.header_smart_list_languages()} variant="inline">
                <MultiSelect
                  options={$languages.data ?? []}
                  included={filters.languages ?? []}
                  placeholder={m.option_text_all()}
                  searchPlaceholder={m.input_placeholder_search_languages()}
                  variant="chip"
                  {disabled}
                  onChange={onLanguagesChange}
                />
              </Filter>
            </div>
          {/if}

          {#if isShown("watchnow_country")}
            <div transition:reveal>
              {@render chipSelect({
                title: m.header_smart_list_streaming_country(),
                options: countryOptions,
                value: filters.watchnow_country,
                onChange: (value) => set("watchnow_country", value),
              })}
            </div>
          {/if}
        </FilterGroup>
      </div>
    {/if}

    {#if isShown("released_within_days", "votes", "imdb_votes")}
      <div transition:reveal>
        <FilterGroup>
          {#if isShown("released_within_days")}
            <div transition:reveal>
              {@render chipSelect({
                title: m.header_smart_list_released_within(),
                options: releaseOptions,
                value: filters.released_within_days?.toString(),
                onChange: (value) =>
                  set(
                    "released_within_days",
                    value == null ? null : Number(value),
                  ),
              })}
            </div>
          {/if}

          {#each VOTES as votes (votes.key)}
            {#if isShown(votes.key)}
              <div transition:reveal>
                {@render chipSelect({
                  title: m.label_smart_list_min_votes({ source: votes.source }),
                  options: voteOptions,
                  value: filters[votes.key]?.at(0)?.toString(),
                  onChange: (value) =>
                    set(
                      votes.key,
                      value == null
                        ? null
                        : [Number(value), OPEN_VOTES_CEILING],
                    ),
                })}
              </div>
            {/if}
          {/each}
        </FilterGroup>
      </div>
    {/if}

    {#if isShown(...RATING_SLIDERS.map((slider) => slider.key))}
      <div transition:reveal>
        <FilterSection title={m.header_smart_list_more_ratings()}>
          <FilterGroup>
            {#each RATING_SLIDERS as slider (slider.key)}
              {#if isShown(slider.key)}
                <div transition:reveal>
                  <SliderField
                    label={slider.label}
                    range={slider.range}
                    value={toSliderValue(slider.key, slider.range)}
                    step={slider.step}
                    ticks={{ count: slider.ticks, formatter: String }}
                    {disabled}
                    onCommit={(range) =>
                      set(slider.key, toRange(slider.key, range))}
                  />
                </div>
              {/if}
            {/each}
          </FilterGroup>
        </FilterSection>
      </div>
    {/if}

    {#if isShown(...visibleToggles.map((toggle) => toggle.key))}
      <div transition:reveal>
        <FilterSection title={m.header_smart_list_hide()}>
          <FilterGroup>
            {#each visibleToggles as toggle (toggle.key)}
              {#if isShown(toggle.key)}
                <div transition:reveal>
                  {@render toggleRow(toggle.key, toggle.label())}
                </div>
              {/if}
            {/each}
          </FilterGroup>
        </FilterSection>
      </div>
    {/if}

    {#if isShown("parental_include_unrated")}
      <div transition:reveal>
        <FilterSection title={m.option_text_certification_parental_guidance()}>
          <FilterGroup>
            {@render toggleRow(
              "parental_include_unrated",
              m.toggle_text_include_unrated_parental(),
            )}
          </FilterGroup>
        </FilterSection>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-smart-list-more-filters {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    &.is-disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .more-filters-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .more-filters-toggle {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    flex: 1;
    min-width: 0;
    height: var(--ni-40);
    padding-inline-start: var(--gap-xxs);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    border-radius: var(--border-radius-m);

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }

    :global(.trakt-dropdown-caret) {
      margin-inline-start: auto;
      color: var(--color-text-secondary);
    }
  }

  .more-filters-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
