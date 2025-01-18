<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import FindMoviesLink from "../components/FindMoviesLink.svelte";
  import MediaItem from "../components/MediaItem.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import { useComingSoon } from "./useComingSoon";
  import { genreCompareFactory } from "./utils/genreCompareFactory";

  type ComingSoonProps = {
    title: string;
  };

  const { title }: ComingSoonProps = $props();
  const type = "movie";

  const { list, isLoading } = useComingSoon(type);
  const { user } = useUser();

  const { compare } = $derived(
    genreCompareFactory($user?.genres ?? [], "asc", "year"),
  );
</script>

<SectionList
  id={`coming-soon-list-${type}`}
  items={$list.sort(compare)}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.coming_soon_empty()}</p>
      <FindMoviesLink />
    {/if}
  {/snippet}
</SectionList>
