<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import MediaItem from "./components/MediaItem.svelte";
  import { useComingSoon } from "./stores/useComingSoon";
  import { useGenreCompare } from "./stores/useGenreCompare";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type ComingSoonProps = {
    title: string;
  };

  const { title }: ComingSoonProps = $props();
  const type = "movie";

  const { list } = useComingSoon(type);
  const { compare } = useGenreCompare();
</script>

<SectionList
  items={$list.sort(compare)}
  {title}
  --height-section-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
</SectionList>
