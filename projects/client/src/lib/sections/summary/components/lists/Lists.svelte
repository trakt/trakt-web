<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import ListSummaryCard from "../../../lists/components/list-summary/ListSummaryCard.svelte";
  import { useListSummary } from "./useListSummary.ts";

  const MAX_MOBILE_LISTS = 3;

  const {
    slug,
    type,
    title,
  }: { slug: string; type: MediaType; title: string } = $props();

  // Due to slow performance, we fetch the lists here instead of useMovie/useShow
  const { isLoading, lists } = useListSummary({ slug, type });
</script>

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <SectionList
    id={`popular-lists-list`}
    items={$lists}
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
  </SectionList>
</RenderFor>

<RenderFor audience="all" device={["mobile"]}>
  <div class="vertical-list-container">
    <h4>{m.popular_lists()}</h4>
    <div class="vertical-list-items">
      {#each $lists.slice(0, MAX_MOBILE_LISTS) as list}
        <ListSummaryCard {list} {type} />
      {/each}
    </div>
  </div>
</RenderFor>

<style>
  .vertical-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: 0 var(--layout-distance-side);

    h4 {
      font-size: var(--ni-24);
    }
  }

  .vertical-list-items {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);

    :global(.trakt-card) {
      --width-card: calc(100vw - 2 * var(--layout-distance-side));
    }
  }
</style>
