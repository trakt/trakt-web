<script lang="ts">
  import ShadowList from "$lib/components/lists/section-list/ShadowList.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import EpisodeItem from "./components/EpisodeItem.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type SeasonEpisodeListProps = {
    show: MediaEntry;
    episodes: EpisodeEntry[];
    title?: string;
    subtitle?: string;
  };

  const { show, episodes, title, subtitle }: SeasonEpisodeListProps = $props();
</script>

<ShadowList
  id={`season-episode-list-${show.slug}`}
  items={episodes}
  {title}
  {subtitle}
  --height-list={mediaListHeightResolver("landscape")}
>
  {#snippet item(episode)}
    <EpisodeItem {episode} {show} variant="default" context="show" />
  {/snippet}
</ShadowList>
