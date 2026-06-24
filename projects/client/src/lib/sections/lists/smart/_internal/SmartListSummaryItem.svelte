<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SmartListActions from "./SmartListActions.svelte";
  import { useSmartListPreview } from "./useSmartListPreview";

  const { list }: { list: SmartList } = $props();

  const href = $derived(UrlBuilder.lists.smart.view(list.id));
  const { posters } = $derived(useSmartListPreview(list));
  const filterSummary = $derived(getFilterSummary(list));

  function targetLabel(target: SmartList["target"]) {
    switch (target) {
      case "trending":
        return m.list_title_trending();
      case "popular":
        return m.list_title_most_popular();
      case "anticipated":
        return m.list_title_most_anticipated();
      case "unknown":
        return m.list_title_smart_lists();
    }
  }

  function splitValues(value: string): string[] {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  function toTitleCase(value: string): string {
    return value
      .replaceAll("-", " ")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function formatRange(
    value: string,
    formatter: (range: { min: number; max: number }) => string,
  ): string {
    const [minValue, maxValue] = value.split("-");

    if (!minValue || !maxValue) {
      return formatPlainRange(value);
    }

    const min = Number(minValue);
    const max = Number(maxValue);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      return value;
    }

    return formatter({ min, max });
  }

  function formatPlainRange(value: string): string {
    const [min, max] = value.split("-");

    if (min && max) {
      return `${min}-${max}`;
    }

    if (min) {
      return `${min}+`;
    }

    if (max) {
      return `Up to ${max}`;
    }

    return value;
  }

  function formatPercentRange(value: string, label: string): string {
    const [min, max] = value.split("-");

    if (min && max) {
      return `${label} ${min}-${max}%`;
    }

    if (min) {
      return `${label} ${min}%+`;
    }

    if (max) {
      return `${label} up to ${max}%`;
    }

    return `${label} ${value}`;
  }

  function formatFilter(key: string, value: string): string[] {
    if (value.length === 0) {
      return [];
    }

    switch (key) {
      case "genres":
      case "subgenres":
        return splitValues(value).map((genre) => toTranslatedGenre(genre));
      case "years":
        return [formatRange(value, m.advanced_filter_label_release_year)];
      case "runtimes":
        return [formatRange(value, m.advanced_filter_label_runtime)];
      case "ratings":
        return [formatPercentRange(value, "Trakt")];
      case "imdb_ratings":
        return [`IMDb ${formatPlainRange(value)}`];
      case "rt_meters":
        return [formatPercentRange(value, "RT")];
      case "rt_user_meters":
        return [formatPercentRange(value, "RT Audience")];
      case "certifications":
        return splitValues(value).map((certification) =>
          certification.toUpperCase()
        );
      case "countries":
        return splitValues(value).map((country) => country.toUpperCase());
      case "statuses":
      case "watchnow":
        return splitValues(value).map(toTitleCase);
      case "ignore_watched":
        return value === "true" ? [m.header_hide_watched()] : [];
      case "ignore_watchlisted":
        return value === "true" ? [m.header_hide_watchlisted()] : [];
      default:
        return [`${toTitleCase(key)} ${value}`];
    }
  }

  function getFilterSummary(list: SmartList): string {
    const filters = Object.entries(list.params)
      .flatMap(([key, value]) => formatFilter(key, value));

    return [targetLabel(list.target), ...filters].join(", ");
  }
</script>

<Card
  --width-card="min(var(--width-list-card), 85vw)"
  --height-card="var(--height-list-card)"
>
  <div class="trakt-smart-list-summary">
    <div class="trakt-smart-list-header">
      <div class="trakt-smart-list-icon" aria-hidden="true">
        {#if list.type === "movie"}
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
        {#each $posters as poster, index (`${list.id}_poster_${index}`)}
          <div class="poster-wrapper" style="--poster-index: {index}">
            <CrossOriginImage
              src={poster}
              alt={m.image_alt_list_preview_poster({ title: list.title })}
            />
          </div>
        {/each}
      </div>
    </Link>
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-summary {
    --smart-list-summary-background: color-mix(
      in srgb,
      var(--color-card-background) 88%,
      var(--color-foreground)
    );

    height: var(--height-list-card);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-12);

    outline: var(--border-thickness-xs) solid transparent;
    transition: outline-color var(--transition-increment) ease-in-out;

    background-color: var(--smart-list-summary-background);
    border-radius: var(--border-radius-m);
  }

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

    --poster-overlap: var(--poster-width) / 5;
    --total-poster-width: calc(
      (var(--poster-width) - var(--poster-overlap)) * var(--poster-count)
    );
    --poster-spread-width: min(100%, var(--total-poster-width));
    --poster-offset: calc(
      (var(--poster-spread-width) - var(--poster-width)) /
        max(1, var(--poster-count) - 1)
    );

    position: absolute;
    left: calc(var(--poster-offset) * var(--poster-index));

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

  @include for-mouse() {
    :global(.trakt-card-content:hover) .trakt-smart-list-summary {
      outline-color: var(--color-card-border-hover);
    }
  }
</style>
