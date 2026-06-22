<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import CreateSmartListButton from "./_internal/CreateSmartListButton.svelte";
  import SmartListSummaryItem from "./_internal/SmartListSummaryItem.svelte";
  import { useSmartLists } from "./useSmartLists";

  const { mode }: { mode: DiscoverMode } = $props();

  const { list, isLoading } = $derived(useSmartLists({ mode }));

  const drilldown = $derived({
    href: UrlBuilder.lists.smart.all(),
    label: m.button_label_view_all_lists(),
    source: { id: "smart-lists" },
    mode: "always" as const,
  });
</script>

{#snippet actions()}
  <CreateSmartListButton />
{/snippet}

<SectionList
  id={{
    scope: "smart-lists",
  }}
  items={$list}
  title={m.list_title_smart_lists()}
  --height-list="var(--height-lists-list)"
  --height-override-list={$list.length === 0
    ? "var(--height-poster-list-sm)"
    : undefined}
  {drilldown}
  {actions}
>
  {#snippet item(list)}
    <SmartListSummaryItem {list} />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <CtaItem cta={{ type: "smart-list" }} variant="placeholder" />
    {/if}
  {/snippet}
</SectionList>
