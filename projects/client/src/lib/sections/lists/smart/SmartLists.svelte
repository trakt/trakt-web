<script lang="ts">
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import ListsHeader from "../user/_internal/ListsHeader.svelte";
  import CreateSmartListButton from "./_internal/CreateSmartListButton.svelte";
  import SmartListRenderer from "./SmartListRenderer.svelte";
  import { useSmartLists } from "./useSmartLists";

  const { mode }: { mode: DiscoverMode } = $props();

  const { list } = $derived(useSmartLists({ mode }));
</script>

{#snippet actions()}
  <CreateSmartListButton />

  <ViewAllButton
    href={UrlBuilder.lists.smart.all()}
    label={m.button_label_view_all_lists()}
    source={{ id: "smart-lists" }}
    disabled={$list.length === 0}
  />
{/snippet}

{#if $list.length === 0}
  <SectionList
    id="smart-lists"
    items={[]}
    title="Smart Lists"
    --height-list="var(--height-poster-list-sm)"
    {actions}
  >
    {#snippet item(_)}{/snippet}
    {#snippet empty()}
      <CtaItem cta={{ type: "smart-list" }} variant="placeholder" />
    {/snippet}
  </SectionList>
{:else}
  <div class="trakt-smart-lists">
    <ListsHeader title="Smart Lists" {actions}>
      {#snippet icon()}
        <SmartListIcon />
      {/snippet}
    </ListsHeader>

    <SmartListRenderer mode={mode ?? "media"} />
  </div>
{/if}

<style>
  .trakt-smart-lists {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
