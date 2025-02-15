<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListSummaryCard from "../components/list-summary/ListSummaryCard.svelte";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";

  const { type }: { type: PersonalListType } = $props();

  const { lists, isLoading } = usePersonalListsSummary({ type });
</script>

<!-- TODO unhide when lists are actionable -->
{#if !$isLoading && $lists.length > 0}
  <SectionList
    id={`personal-lists-${type}-list`}
    items={$lists}
    title={type === "personal" ? m.personal_lists() : m.collaborations()}
    --height-list="var(--height-lists-list)"
  >
    {#snippet item(list)}
      <ListSummaryCard {list} />
    {/snippet}
  </SectionList>
{/if}
