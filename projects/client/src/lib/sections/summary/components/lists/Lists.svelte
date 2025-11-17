<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import ListSummaryItem from "$lib/sections/lists/components/list-summary/ListSummaryItem.svelte";
  import UserList from "$lib/sections/lists/user/UserList.svelte";
  import { MAX_LISTS } from "./_internal/constants.ts";
  import { useListSummary } from "./useListSummary.ts";

  const {
    slug,
    type,
    title,
  }: { slug: string; type: MediaType; title: string } = $props();

  // Due to slow performance, we fetch the lists here instead of useMovie/useShow
  const { isLoading, personalLists, officialLists } = $derived(
    useListSummary({
      slug,
      type,
    }),
  );

  const lists = $derived(
    [...$officialLists, ...$personalLists].slice(0, MAX_LISTS),
  );
  const topList = $derived(lists.at(0));
</script>

{#snippet topUserList()}
  {#if topList}
    <UserList list={topList} {type} />
  {/if}
{/snippet}

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <SectionList
    id={`popular-lists-list-${slug}`}
    items={lists}
    title={m.list_title_popular_lists()}
    --height-list="var(--height-lists-list)"
  >
    {#snippet item(list)}
      <ListSummaryItem
        {list}
        {type}
        isOfficial={$officialLists.includes(list)}
      />
    {/snippet}

    {#snippet empty()}
      {#if !$isLoading}
        <p>{m.list_placeholder_popular_lists({ title })}</p>
      {/if}
    {/snippet}

    {#snippet badge()}
      <Preview />
    {/snippet}
  </SectionList>
</RenderFor>

<RenderFor audience="all" device={["mobile"]}>
  {@render topUserList()}
</RenderFor>
