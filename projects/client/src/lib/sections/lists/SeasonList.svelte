<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import ShadowList from "$lib/components/lists/section-list/ShadowList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { Season } from "$lib/requests/models/Season";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { writable } from "svelte/store";
  import EpisodeCard from "./components/EpisodeCard.svelte";
  import { useSeasonEpisodes } from "./stores/useSeasonEpisodes";
  import { useUserSeason } from "./stores/useUserSeason";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type SeasonListProps = {
    show: MediaEntry;
    seasons: Season[];
  };

  const { show, seasons }: SeasonListProps = $props();

  const season = useUserSeason(show.id);
  const active = writable(seasons.at(0));
  const { list } = $derived(useSeasonEpisodes(show.slug, $active.number));

  const title = $derived(m.season_number_label({ number: $active.number }));

  const seasonUnsubscribe = season.subscribe((seasonNumber) => {
    const season = seasons.find((s) => s.number === seasonNumber);

    if (season) {
      active.set(season);
    }

    if (seasonNumber !== -1) {
      queueMicrotask(() => seasonUnsubscribe());
    }
  });
</script>

<ShadowList
  id={`season-list-${show.slug}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet item(episode)}
    <EpisodeCard {episode} {show} variant="default" context="show" />
  {/snippet}
  {#snippet actions()}
    {#if seasons.length > 1}
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
    {/if}
    <RenderFor audience="authenticated">
      <MarkAsWatchedAction
        style="action"
        type="episode"
        size="small"
        title={m.season_number_label({ number: $active.number })}
        media={$list}
        episode={$list}
        {show}
      />
    </RenderFor>
  {/snippet}
</ShadowList>

<style>
  :global(.shadow-list-container) {
    :global(.trakt-dropdown-list-container[data-size="small"]) {
      margin-right: var(--ni-neg-10);
    }
  }
</style>
