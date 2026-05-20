<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { Season } from "$lib/requests/models/Season";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type SeasonDropdownProps = {
    showSlug: string;
    seasons: Season[];
    currentSeason: number;
    urlBuilder?: (seasonNumber: number) => string;
  };

  const { showSlug, seasons, currentSeason, urlBuilder }: SeasonDropdownProps =
    $props();

  const buildUrl = $derived(
    urlBuilder ?? ((n: number) => UrlBuilder.show(showSlug, { season: n })),
  );

  const seasonText = (seasonNumber: number) => {
    return seasonNumber === 0 ? m.text_season_specials() : `${seasonNumber}`;
  };
</script>

<DropdownList label={m.list_title_seasons()} disabled={seasons.length < 2}>
  {seasonText(currentSeason)}
  {#snippet items()}
    {#each seasons as season (season.id)}
      <DropdownItem color="blue" href={buildUrl(season.number)} noscroll>
        {seasonText(season.number)}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
