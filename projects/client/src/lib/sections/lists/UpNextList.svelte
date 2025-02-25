<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import LabSwitch from "$lib/components/badge/LabSwitch.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { UpNextEntry } from "$lib/requests/queries/sync/upNextQuery";
  import { writable } from "svelte/store";
  import DropAction from "../media-actions/drop/DropAction.svelte";
  import MarkAsWatchedAction from "../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "./components/EpisodeCard.svelte";
  import FindShowsLink from "./components/FindShowsLink.svelte";
  import { useHiddenShows } from "./stores/useHiddenShows";
  import { useStableArray } from "./stores/useStableArray";
  import { useUpNextEpisodes } from "./stores/useUpNextEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const isNitro = writable(false);

  const type = $derived($isNitro ? "nitro" : "standard");

  const { list: unstable, isLoading: isLoadingEpisodes } = $derived(
    useUpNextEpisodes(type),
  );

  const { list: hidden, isLoading: isLoadingHidden } =
    $derived(useHiddenShows());

  const stableArray = {
    nitro: useStableArray<UpNextEntry>((l, r) => l.show.id === r.show.id),
    standard: useStableArray<UpNextEntry>((l, r) => l.show.id === r.show.id),
  };

  const { list, set } = $derived(stableArray[type]);

  const hasHidden = $derived(!$isLoadingHidden && $hidden.length > 0);

  $effect(() => {
    return unstable.subscribe(set);
  });
</script>

<SectionList
  id="up-next-list"
  items={$list}
  title={m.up_next_title()}
  --height-list={mediaListHeightResolver("episode")}
>
  {#snippet badge()}
    <LabSwitch
      tooltip={`${m.lab_up_next_nitro_message()} ${hasHidden ? m.lab_up_next_nitro_hidden_message() : ""}`}
      label={m.lab_up_next_nitro_label()}
      enabled={$isNitro}
      onclick={() => isNitro.update((prev) => !prev)}
    />
  {/snippet}
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
