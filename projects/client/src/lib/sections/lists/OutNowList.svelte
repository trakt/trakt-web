<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import MediaItem from "./components/MediaItem.svelte";
  import { useOutNow } from "./stores/useOutNow";
  import { genreCompareFactory } from "./utils/genreCompareFactory";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type ComingSoonProps = {
    title: string;
  };

  const { title }: ComingSoonProps = $props();
  const type = "movie";

  const { list } = useOutNow(type);
  const { user } = useUser();

  const { compare } = $derived(
    genreCompareFactory($user?.genres ?? [], "desc", "genre"),
  );
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
