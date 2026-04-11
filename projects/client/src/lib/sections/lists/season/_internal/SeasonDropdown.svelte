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
  };

  const { showSlug, seasons, currentSeason }: SeasonDropdownProps = $props();
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
  {currentSeason}
  {#snippet items()}
    {#each seasons as season (season.id)}
      <DropdownItem
        color="blue"
        href={UrlBuilder.show(showSlug, { season: season.number })}
        noscroll
      >
        {season.number}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
