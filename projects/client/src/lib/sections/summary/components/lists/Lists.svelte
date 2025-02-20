<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import ListPreview from "../../../lists/components/list-summary/ListPreview.svelte";
  import ListSummaryCard from "../../../lists/components/list-summary/ListSummaryCard.svelte";
  import { MAX_LISTS } from "./_internal/constants.ts";
  import { useListSummary } from "./useListSummary.ts";

  const {
    slug,
    type,
    title,
  }: { slug: string; type: MediaType; title: string } = $props();

  // Due to slow performance, we fetch the lists here instead of useMovie/useShow
  const { isLoading, personalLists, officialLists } = useListSummary({
    slug,
    type,
  });

  const lists = $derived(
    [...$officialLists, ...$personalLists].slice(0, MAX_LISTS),
  );
  const topList = $derived(lists.at(0));
</script>

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <SectionList
    id={`popular-lists-list`}
    items={lists}
    title={m.popular_lists()}
    --height-list="var(--height-lists-list)"
  >
    {#snippet item(list)}
      <ListSummaryCard {list} {type} />
    {/snippet}

    {#snippet empty()}
      {#if !$isLoading}
        <p class="small">{m.no_popular_lists({ title })}</p>
      {/if}
    {/snippet}

    {#snippet badge()}
      <Preview />
    {/snippet}
  </SectionList>
</RenderFor>

<RenderFor audience="all" device={["mobile"]}>
  {#if topList}
    <ListPreview list={topList} {type} />
  {/if}
</RenderFor>
