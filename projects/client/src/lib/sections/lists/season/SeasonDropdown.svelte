<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SeasonDropdownProps } from "./SeasonDropdownProps.ts";

  const { showSlug, seasons, currentSeason, urlBuilder }: SeasonDropdownProps =
    $props();

  const buildUrl = $derived(
    urlBuilder ?? ((n: number) => UrlBuilder.show(showSlug, { season: n })),
  );

  const seasonText = (seasonNumber: number) => {
    return seasonNumber === 0 ? m.text_season_specials() : `${seasonNumber}`;
  };
</script>

<DropdownList
  preferNative
  label={m.list_title_seasons()}
  style="flat"
  variant="primary"
  color="blue"
  size="small"
  disabled={seasons.length < 2}
>
  {seasonText(currentSeason)}
  {#snippet items()}
    {#each seasons as season (season.id)}
      <DropdownItem
        color="blue"
        href={buildUrl(season.number)}
        noscroll
        selected={season.number === currentSeason}
      >
        {seasonText(season.number)}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
