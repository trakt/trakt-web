<script lang="ts">
  import GlanceTitleLink from "../../_internal/GlanceTitleLink.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import SummaryCardRating from "$lib/sections/lists/components/_internal/SummaryCardRating.svelte";
  import Summary from "../../_internal/Summary.svelte";
  import SeasonEpisodesTab from "../../seasons/SeasonEpisodesTab.svelte";
  import { mediaGlanceNavigation } from "../mediaGlanceNavigation.ts";
  import MediaGlanceSkeleton from "./MediaGlanceSkeleton.svelte";
  import { useShowGlance } from "./useShowGlance.ts";

  const {
    slug,
    season,
  }: {
    slug: string;
    season: number;
  } = $props();

  const { show, seasons, isLoading } = useShowGlance(fromRune(() => slug));

  const entry = $derived($seasons?.find(({ number }) => number === season));
  const href = $derived(UrlBuilder.seasonDrawer(slug, season));

  const { buildEpisodeGlanceLink } = mediaGlanceNavigation();
  const buildEpisodeLink = (target: { season: number; episode: number }) =>
    buildEpisodeGlanceLink({ slug, ...target });
</script>

{#if $isLoading}
  <MediaGlanceSkeleton />
{:else if $show && entry}
  <Summary variant="drawer">
    {#snippet poster()}
      <SummaryPoster
        src={entry.poster?.url.medium ?? $show.poster.url.medium}
        alt={seasonLabel(entry.number)}
        {href}
        target="_self"
      />
    {/snippet}


    {#snippet meta()}
      <div class="trakt-season-glance-titles">
        <GlanceTitleLink {href}>
          <p class="trakt-card-title">
            {entry.title ?? seasonLabel(entry.number)}
          </p>
        </GlanceTitleLink>

        <p class="small secondary">
          {entry.title ? seasonLabel(entry.number) : $show.title}
        </p>
      </div>

      <div class="trakt-season-glance-rating">
        <SummaryCardRating item={entry} />
      </div>
    {/snippet}

    <div class="trakt-season-glance-overview">
      <p class="secondary small">{entry.overview ?? ""}</p>
    </div>

    <SeasonEpisodesTab
      show={$show}
      seasons={$seasons ?? []}
      currentSeason={season}
      {buildEpisodeLink}
    />
  </Summary>
{/if}

<style lang="scss">
  .trakt-season-glance-titles {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-micro);
  }

  .trakt-card-title {
    font-size: var(--font-size-text);
  }

  .trakt-season-glance-rating {
    display: flex;
    justify-content: center;

    min-height: var(--glance-ratings-height);
  }

  .trakt-season-glance-overview {
    min-height: var(--glance-overview-height);

    p {
      display: -webkit-box;

      line-clamp: var(--glance-overview-lines);
      -webkit-line-clamp: var(--glance-overview-lines);
      -webkit-box-orient: vertical;

      overflow: hidden;
    }
  }
</style>
