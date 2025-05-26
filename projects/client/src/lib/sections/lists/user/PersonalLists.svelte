<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListSummaryItem from "../components/list-summary/ListSummaryItem.svelte";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";
  import UserList from "./UserList.svelte";

  const { type, slug }: { type: PersonalListType; slug: string } = $props();

  const { lists, isLoading } = $derived(
    usePersonalListsSummary({ type, slug }),
  );

  const title = $derived.by(() => {
    switch (type) {
      case "personal":
        return m.personal_lists();
      case "liked":
        return m.liked_lists();
      case "collaboration":
        return m.collaborative_lists();
      default:
        return "";
    }
  });

  const variant = $derived.by(() => {
    if ($lists.length === 1) {
      return "preview";
    }

    return "summary";
  });
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
      {title}
      --height-list="var(--height-lists-list)"
    >
      {#snippet item(list)}
        <ListSummaryItem {list} isOfficial={false} />
      {/snippet}
    </SectionList>
  {/if}
{/if}
