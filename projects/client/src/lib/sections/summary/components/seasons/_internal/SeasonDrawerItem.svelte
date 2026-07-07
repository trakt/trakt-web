<script lang="ts">
  import SeasonItem from "$lib/sections/lists/components/SeasonItem.svelte";
  import SeasonActions from "$lib/sections/lists/season/SeasonActions.svelte";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import type { SeasonDrawerItemProps } from "./SeasonDrawerItemProps.ts";

  const {
    show,
    season,
    isCurrentSeason,
    urlBuilder,
  }: SeasonDrawerItemProps = $props();

  const title = $derived(seasonLabel(season.number));
  const { list: episodes, isLoading } = $derived(
    useSeasonEpisodes(show.slug, season.number),
  );
</script>

{#snippet popupActions()}
  <SeasonActions
    {title}
    episodes={$episodes}
    {show}
    seasonId={season.id}
    isLoading={$isLoading}
  />
{/snippet}

<SeasonItem
  media={show}
  {season}
  {isCurrentSeason}
  {urlBuilder}
  {popupActions}
/>
