<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListSummaryItem from "../components/list-summary/ListSummaryItem.svelte";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";
  import UserList from "./UserList.svelte";

  const {
    type,
    variant,
    slug,
  }: { type: PersonalListType; variant: "summary" | "preview"; slug: string } =
    $props();

  const { lists, isLoading } = $derived(
    usePersonalListsSummary({ type, slug }),
  );
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
        <ListSummaryItem {list} isOfficial={false} />
      {/snippet}
    </SectionList>
  {/if}
{/if}
