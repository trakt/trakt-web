<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { UpNextEntry } from "$lib/requests/queries/sync/upNextQuery";
  import { onMount } from "svelte";
  import DropAction from "../media-actions/drop/DropAction.svelte";
  import MarkAsWatchedAction from "../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "./components/EpisodeCard.svelte";
  import FindShowsLink from "./components/FindShowsLink.svelte";
  import { useHiddenShows } from "./stores/useHiddenShows";
  import { useStableArray } from "./stores/useStableArray";
  import { useUpNextEpisodes } from "./stores/useUpNextEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { list: unstable, isLoading: isLoadingEpisodes } =
    $derived(useUpNextEpisodes());

  const { list: hidden } = $derived(useHiddenShows());

  const { list, set } = useStableArray<UpNextEntry>(
    (l, r) => l.show.id === r.show.id,
  );

  onMount(() => {
    const unsubscribe = unstable.subscribe(set);

    return () => unsubscribe();
  });
</script>

<SectionList
  id="up-next-list"
  items={$list}
  title={m.up_next_title()}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet item(episode)}
    <EpisodeCard
      {episode}
      show={episode.show}
      status={$hidden.includes(episode.show.id) ? "hidden" : "watching"}
      variant="next"
    >
      {#snippet popupActions()}
        <RenderFor audience="authenticated">
          <MarkAsWatchedAction
            style="dropdown-item"
            type="episode"
            title={episode.title}
            show={episode.show}
            {episode}
            media={episode}
          />
          <DropAction
            style="dropdown-item"
            title={episode.show.title}
            id={episode.show.id}
          />
        </RenderFor>
      {/snippet}
    </EpisodeCard>
  {/snippet}
  {#snippet empty()}
    {#if !$isLoadingEpisodes}
      <p class="small">{m.up_next_empty()}</p>
      <FindShowsLink />
    {/if}
  {/snippet}
</SectionList>
