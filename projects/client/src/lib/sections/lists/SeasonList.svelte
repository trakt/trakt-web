<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import ShadowList from "$lib/components/section-list/ShadowList.svelte";
  import type { Season } from "$lib/models/Season";
  import { writable } from "svelte/store";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import { useSeasonEpisodes } from "./stores/useSeasonEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type SeasonListProps = {
    slug: string;
    seasons: Season[];
  };

  const { slug, seasons }: SeasonListProps = $props();

  const active = writable(seasons.at(0));
  const { list } = $derived(useSeasonEpisodes(slug, $active.number));

  const title = $derived(m.season_number_label({ number: $active.number }));
</script>

<ShadowList
  id={`season-list-${slug}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet item(episode)}
    <EpisodeItem {episode} />
  {/snippet}
  {#snippet actions()}
    <DropdownList
      label="Seasons"
      style="flat"
      variant="primary"
      color="blue"
      text="capitalize"
      size="small"
    >
      {title}
      {#snippet items()}
        {#each seasons as season}
          <DropdownItem color="blue" onclick={() => active.set(season)}>
            {m.season_number_label({ number: season.number })}
          </DropdownItem>
        {/each}
      {/snippet}
    </DropdownList>
  {/snippet}
</ShadowList>

<style>
  :global(.shadow-list-container) {
    :global(.trakt-dropdown-list-container[data-size="small"]) {
      margin-right: var(--ni-neg-36);
    }
  }
</style>
