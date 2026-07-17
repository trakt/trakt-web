<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import JustWatchInfoSkeleton from "./_internal/JustWatchInfoSkeleton.svelte";
  import { whereToWatchListScope } from "./_internal/whereToWatchListScope.ts";
  import WhereToWatchSkeletonItems from "./_internal/WhereToWatchSkeletonItems.svelte";

  const { type, slug, variant }: {
    type: ExtendedMediaType;
    slug: string;
    variant?: ListVariant;
  } = $props();
</script>

<div class="trakt-where-to-watch-list">
  <SectionList
    id={{ scope: whereToWatchListScope(type), key: slug }}
    items={[]}
    title={m.list_title_where_to_watch()}
    {variant}
    --height-list="var(--height-where-to-watch-list)"
  >
    {#snippet metaInfo()}
      <JustWatchInfoSkeleton />
    {/snippet}

    {#snippet item()}{/snippet}

    {#snippet empty()}
      <WhereToWatchSkeletonItems />
    {/snippet}
  </SectionList>
</div>

<style>
  .trakt-where-to-watch-list {
    :global(.trakt-list-title) {
      gap: var(--gap-xs);
    }
  }
</style>
