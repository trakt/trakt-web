<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import FindMoviesLink from "../components/FindMoviesLink.svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import { useOutNow } from "./useOutNow";
  import { genreCompareFactory } from "./utils/genreCompareFactory";

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

{#snippet item(media: MediaSummary)}
  <MediaCard type={media.type} {media}>
    {#snippet action()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          style="action"
          title={media.title}
          type={media.type}
          {media}
        />
      </RenderFor>
    {/snippet}
  </MediaCard>
{/snippet}

<SectionList
  id={`out-now-list-${type}`}
  items={$list.sort(compare)}
  {title}
  {item}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.out_now_empty()}</p>
      <FindMoviesLink />
    {/if}
  {/snippet}
</SectionList>
