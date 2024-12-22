<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import FindMoviesLink from "./components/FindMoviesLink.svelte";
  import MediaItem from "./components/MediaItem.svelte";
  import { useOutNow } from "./stores/useOutNow";
  import { genreCompareFactory } from "./utils/genreCompareFactory";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type ComingSoonProps = {
    title: string;
  };

  const { title }: ComingSoonProps = $props();
  const type = "movie";

  const { list, isLoading } = useOutNow(type);
  const { user } = useUser();

  const { compare } = $derived(
    genreCompareFactory($user?.genres ?? [], "desc", "genre"),
  );
</script>

<SectionList
  id={`out-now-list-${type}`}
  items={$list.sort(compare)}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.out_now_empty()}</p>
      <FindMoviesLink />
    {/if}
  {/snippet}
</SectionList>
