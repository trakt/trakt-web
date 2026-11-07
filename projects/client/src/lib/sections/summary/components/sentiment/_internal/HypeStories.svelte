<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { HypeReasons } from "$lib/requests/models/HypeReasons.ts";
  import type { MatchTaste } from "$lib/requests/models/MatchTaste.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import HypeFilmPoster from "./HypeFilmPoster.svelte";
  import InsightsStory from "./InsightsStory.svelte";

  const MAX_POSTERS = 4;

  const {
    reasons,
    taste,
    media,
  }: {
    reasons: HypeReasons | null;
    taste: MatchTaste[];
    media: MediaEntry;
  } = $props();

  const series = $derived(reasons?.series ?? null);
  const lists = $derived(reasons?.lists ?? null);

  const usualText = $derived.by(() => {
    if (series?.usual === "above") return m.text_hype_series_above();
    if (series?.usual === "below") return m.text_hype_series_below();
    return m.text_hype_series_about();
  });

  const airDate = $derived(isMaxDate(media.airDate) ? null : media.airDate);

  const hasStories = $derived(
    series !== null || lists !== null || taste.length > 0,
  );
</script>

<section class="trakt-hype-stories">
  {#if hasStories}
    <p class="bold">{m.header_hype_why()}</p>

    {#if series}
      <InsightsStory title={m.text_hype_series_rated()} detail={usualText}>
        {#snippet art()}
          {#each series.films.slice(-MAX_POSTERS) as film (film.ids.trakt)}
            <HypeFilmPoster slug={film.ids.slug} title={film.title} stars={film.stars} />
          {/each}
        {/snippet}
      </InsightsStory>
    {/if}

    {#if lists}
      <InsightsStory title={m.text_hype_lists()} detail={m.text_hype_lists_detail()}>
        {#snippet art()}
          <span class="trakt-insights-badge">
            {m.text_hype_lists_badge({ percent: lists.top })}
          </span>
        {/snippet}
      </InsightsStory>
    {/if}

    {#if taste.length > 0}
      <InsightsStory
        title={m.text_insights_taste()}
        detail={taste.map(({ label }) => label).join(" · ")}
      >
        {#snippet art()}
          <span class="trakt-insights-badge" aria-hidden="true">♥</span>
        {/snippet}
      </InsightsStory>
    {/if}
  {/if}

  {#if airDate}
    <p class="trakt-hype-release secondary small">
      {m.text_hype_out_on({ date: toHumanDay({ date: airDate, locale: getLocale() }) })}
    </p>
  {/if}
</section>

<style>
  .trakt-hype-stories {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-hype-release {
    display: flex;
    align-items: center;
    min-height: var(--ni-16);
    margin: 0;
    padding-top: var(--gap-xs);
  }
</style>
