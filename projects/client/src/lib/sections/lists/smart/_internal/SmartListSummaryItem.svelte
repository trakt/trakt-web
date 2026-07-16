<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery.ts";
  import ListSummaryCard from "$lib/sections/lists/components/ListSummaryCard.svelte";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SmartListActions from "./SmartListActions.svelte";
  import { useSmartListPreview } from "./useSmartListPreview";

  const { list }: { list: SmartList } = $props();

  const href = $derived(UrlBuilder.lists.smart.view(list.slug));
  const { posters } = $derived(useSmartListPreview(list));
  const filterSummary = $derived(getFilterSummary(list));

  function sourceLabel(source: SmartList["source"]) {
    switch (source) {
      case "trending":
        return m.list_title_trending();
      case "popular":
        return m.list_title_most_popular();
      case "anticipated":
        return m.list_title_most_anticipated();
      case "recommendations":
        return m.list_title_recommended();
      case "discover":
        return m.button_label_discover();
    }
  }

  function toTitleCase(value: string): string {
    return value
      .replaceAll("-", " ")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function toRatingPercentage(value: number): string {
    return toPercentage(value / 100, languageTag());
  }

  function formatNumberRange(
    range: number[],
    formatter: (value: { min: number; max: number }) => string,
  ): string {
    const [min, max] = range;

    if (min != null && max != null) {
      return formatter({ min, max });
    }

    if (min != null) {
      return m.list_summary_range_from({ value: String(min) });
    }

    if (max != null) {
      return m.list_summary_range_up_to({ value: String(max) });
    }

    return "";
  }

  function formatPlainRange(range: number[]): string {
    const [min, max] = range;

    if (min != null && max != null) {
      return m.list_summary_range_between({
        min: String(min),
        max: String(max),
      });
    }

    if (min != null) {
      return m.list_summary_range_from({ value: String(min) });
    }

    if (max != null) {
      return m.list_summary_range_up_to({ value: String(max) });
    }

    return "";
  }

  function formatPercentRange(range: number[], label: string): string {
    const [min, max] = range;

    if (min != null && max != null) {
      return m.list_summary_range_labeled_between({
        label,
        min: toRatingPercentage(min),
        max: toRatingPercentage(max),
      });
    }

    if (min != null) {
      return m.list_summary_range_labeled_from({
        label,
        value: toRatingPercentage(min),
      });
    }

    if (max != null) {
      return m.list_summary_range_labeled_up_to({
        label,
        value: toRatingPercentage(max),
      });
    }

    return label;
  }

  function formatList(key: string, values: string[]): string[] {
    switch (key) {
      case "genres":
      case "subgenres":
        return values.map((genre) => toTranslatedGenre(genre));
      case "certifications":
      case "countries":
        return values.map((value) => value.toUpperCase());
      default:
        return values.map(toTitleCase);
    }
  }

  function formatRange(key: string, range: number[]): string[] {
    switch (key) {
      case "years":
        return [formatNumberRange(range, m.advanced_filter_label_release_year)];
      case "runtimes":
        return [formatNumberRange(range, m.advanced_filter_label_runtime)];
      case "ratings":
        return [formatPercentRange(range, "Trakt")];
      case "imdb_ratings":
        return [`IMDb ${formatPlainRange(range)}`];
      case "rt_meters":
        return [formatPercentRange(range, "RT")];
      case "rt_user_meters":
        return [formatPercentRange(range, "RT Audience")];
      default:
        return [];
    }
  }

  function formatFilter(key: string, value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.every((item) => typeof item === "string")
        ? formatList(key, value as string[])
        : formatRange(key, value as number[]);
    }

    if (value === true && key === "ignore_watched") {
      return [m.header_hide_watched()];
    }

    if (value === true && key === "ignore_watchlisted") {
      return [m.header_hide_watchlisted()];
    }

    return [];
  }

  function getFilterSummary(list: SmartList): string {
    const filters = Object.entries(list.filters)
      .flatMap(([key, value]) => formatFilter(key, value));

    return [sourceLabel(list.source), ...filters].join(", ");
  }
</script>

<ListSummaryCard>
  <div class="trakt-smart-list-header">
    <div class="trakt-smart-list-icon" aria-hidden="true">
      {#if list.mediaType === "movies"}
        <MovieIcon />
      {:else}
        <ShowIcon />
      {/if}
    </div>

    <div class="trakt-smart-list-title">
      <Link {href}>
        <p class="secondary bold ellipsis">{list.title}</p>
      </Link>
      <p class="secondary small ellipsis">
        {filterSummary}
      </p>
    </div>

    <SmartListActions {list} />
  </div>

  <Link {href} color="inherit">
    <div
      class="trakt-smart-list-posters"
      style="--poster-count: {$posters.length}"
    >
      {#each $posters as poster, index (`${list.slug}_poster_${index}`)}
        <div class="poster-wrapper" style="--poster-index: {index}">
          <CrossOriginImage
            src={poster}
            alt={m.image_alt_list_preview_poster({ title: list.title })}
          />
        </div>
      {/each}
    </div>
  </Link>
</ListSummaryCard>

<style lang="scss">
  .trakt-smart-list-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-width: 0;
  }

  .trakt-smart-list-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-40);
    height: var(--ni-40);
    flex-shrink: 0;

    color: var(--color-text-secondary);
    background-color: color-mix(
      in srgb,
      var(--color-card-background) 78%,
      var(--color-foreground)
    );
    border-radius: var(--border-radius-s);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .trakt-smart-list-title {
    display: grid;
    min-width: 0;
    flex-grow: 1;

    :global(.trakt-link) {
      min-width: 0;
      text-decoration: none;
    }
  }

  .trakt-smart-list-posters {
    --poster-width: var(--ni-120);
    --poster-height: var(--ni-180);

    height: var(--poster-height);
    width: 100%;

    display: flex;
    flex-shrink: 0;

    position: relative;

    counter-reset: number;
  }

  .poster-wrapper {
    --poster-index: 0;

    --poster-overlap: calc(var(--poster-width) / 5);
    --total-poster-width: calc(
      (var(--poster-width) - var(--poster-overlap)) * var(--poster-count)
    );
    --poster-spread-width: min(100%, var(--total-poster-width));
    --poster-offset: calc(
      (var(--poster-spread-width) - var(--poster-width)) /
        max(1, var(--poster-count) - 1)
    );

    position: absolute;
    inset-inline-start: calc(var(--poster-offset) * var(--poster-index));

    height: var(--poster-height);
    width: var(--poster-width);

    box-shadow: var(--shadow-floating);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
    }
  }
</style>
