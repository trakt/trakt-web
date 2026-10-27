<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";

  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes";
  import SeasonRecapButton from "$lib/sections/summary/components/recap/SeasonRecapButton.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import SeasonDropdown from "./SeasonDropdown.svelte";
  import SeasonEpisodeList from "./_internal/SeasonEpisodeList.svelte";
  import SeasonPosterList from "./_internal/SeasonPosterList.svelte";

  type SeasonListProps = {
    show: ShowEntry;
    seasons: Season[];
    currentSeason: number;
    currentEpisode?: number;
    hasRecap?: boolean;
  };

  const {
    show,
    seasons,
    currentSeason,
    currentEpisode,
    hasRecap = false,
  }: SeasonListProps = $props();

  const { list: episodes } = $derived(
    useSeasonEpisodes(show.slug, currentSeason),
  );

  const title = m.list_title_seasons();
  const subtitle = $derived(seasonLabel(currentSeason));
  const hasSingleSeason = $derived(seasons.length === 1);

  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isLargeScreen = $derived($isTabletLarge || $isDesktop);

  const { isEnabled } = useFeatureFlag();
  const isSeasonRecapEnabled = $derived(isEnabled(FeatureFlag.SeasonRecap));

  const previousSeasons = $derived(
    seasons.filter((s) => s.number > 0 && s.number < currentSeason),
  );

  const hasDropdown = $derived(isLargeScreen && !hasSingleSeason);
  const isRecapShown = $derived(
    hasRecap && $isSeasonRecapEnabled && (isLargeScreen || hasSingleSeason),
  );

  const episodeProps = $derived.by(() => {
    if (hasSingleSeason) return { title, subtitle };
    return isLargeScreen ? { title } : {};
  });
</script>

{#snippet recapAction()}
  <RenderForFeature flag={FeatureFlag.SeasonRecap} audience="director">
    {#snippet enabled()}
      <SeasonRecapButton slug={show.slug} season={currentSeason} />
    {/snippet}
  </RenderForFeature>
{/snippet}

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  {#if seasons.length > 1}
    <SeasonPosterList
      {show}
      {seasons}
      {title}
      {subtitle}
      {currentSeason}
      actions={hasRecap && $isSeasonRecapEnabled ? recapAction : undefined}
    />
  {/if}
</RenderFor>

{#snippet headerActions()}
  {#if isRecapShown}
    {@render recapAction()}
  {/if}

  {#if hasDropdown}
    <SeasonDropdown
      showSlug={show.slug}
      {seasons}
      {currentSeason}
    />
  {/if}
{/snippet}

<SeasonEpisodeList
  {show}
  {previousSeasons}
  episodes={$episodes}
  {currentEpisode}
  headerActions={hasDropdown || isRecapShown ? headerActions : undefined}
  {...episodeProps}
/>
