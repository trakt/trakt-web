<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListSummaryCard from "../components/list-summary/ListSummaryCard.svelte";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";
  import UserList from "./UserList.svelte";

  const {
    type,
    variant,
  }: { type: PersonalListType; variant: "summary" | "preview" } = $props();

  const { lists, isLoading } = usePersonalListsSummary({ type });
</script>

<!-- TODO unhide when lists are actionable -->
{#if !$isLoading && $lists.length > 0}
  {#if variant === "preview"}
    {#each $lists as list}
      {#if list.count > 0}
        <UserList {list} />
      {/if}
    {/each}
  {/if}

  {#if variant === "summary"}
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
{/if}
