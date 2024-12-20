<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextEntry } from "$lib/requests/queries/sync/upNextQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";
  import NextEpisodeItem from "./components/NextEpisodeItem.svelte";
  import { useStableArray } from "./stores/useStableArray";
  import { useUpNextEpisodes } from "./stores/useUpNextEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { list: unstable, isLoading } = useUpNextEpisodes();
  const { list, set } = useStableArray<UpNextEntry>(
    (l, r) => l.show.id === r.show.id,
  );

  onMount(() => {
    const unsubscribe = unstable.subscribe(set);

    return () => unsubscribe();
  });
</script>

<SectionList
  items={$list}
  title={m.up_next_title()}
  --height-section-list={mediaListHeightResolver("episode")}
>
  {#snippet item(episode)}
    <NextEpisodeItem {episode} show={episode.show} />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.up_next_empty()}</p>
      <Button
        href={UrlBuilder.shows()}
        label={m.navbar_link_shows_label()}
        style="ghost"
        variant="primary"
      >
        {m.navbar_link_shows()}
      </Button>
    {/if}
  {/snippet}
</SectionList>
