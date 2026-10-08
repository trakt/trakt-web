<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { untrack } from "svelte";
  import BulkAddRow from "./BulkAddRow.svelte";
  import type { BulkAddSourceItemsProps } from "./BulkAddSourceItemsProps.ts";
  import { toBulkAddPick } from "./toBulkAddPick.ts";
  import { useBulkAddSourceItems } from "./useBulkAddSourceItems.ts";

  const {
    source,
    listName,
    listedKeys,
    picks,
    onTogglePick,
    onToggleAllPicks,
  }: BulkAddSourceItemsProps = $props();

  const { items, isLoading, hasNextPage, fetchNextPage } =
    useBulkAddSourceItems(untrack(() => source));

  const pickedKeys = $derived(new Set(picks.map(({ key }) => key)));
  const alreadyInListCount = $derived(
    $items.filter(({ key }) => listedKeys.has(key)).length,
  );
  const candidates = $derived(
    $items
      .filter(({ key }) => !listedKeys.has(key))
      .map((item) => toBulkAddPick({ item, sourceKey: source.key })),
  );
  const isAllPicked = $derived(
    candidates.length > 0 && candidates.every(({ key }) => pickedKeys.has(key)),
  );
</script>

<div class="trakt-bulk-add-source-items">
  {#if alreadyInListCount > 0}
    <p class="items-status small secondary">
      {m.text_add_from_lists_already_in_list({
        count: alreadyInListCount,
        name: listName,
      })}
    </p>
  {/if}

  <div class="items-list">
    {#each $items as item (item.key)}
      <BulkAddRow
        {item}
        isPicked={pickedKeys.has(item.key)}
        isInList={listedKeys.has(item.key)}
        onToggle={() =>
          onTogglePick(toBulkAddPick({ item, sourceKey: source.key }))}
      />
    {:else}
      {#if $isLoading}
        <LoadingIndicator />
      {:else}
        <p class="secondary items-empty">{m.text_no_titles_to_add()}</p>
      {/if}
    {/each}

    {#if candidates.length > 0 || $hasNextPage}
      <div class="items-more">
        {#if candidates.length > 0}
          {@const text = isAllPicked
            ? m.button_text_deselect_all()
            : m.button_text_select_all()}
          <Button
            label={text}
            style="flat"
            variant="secondary"
            color="default"
            onclick={() => onToggleAllPicks(candidates)}
          >
            {text}
          </Button>
        {/if}

        {#if $hasNextPage}
          <Button
            label={m.button_text_load_more()}
            style="flat"
            variant="secondary"
            color="default"
            disabled={$isLoading}
            onclick={fetchNextPage}
          >
            {m.button_text_load_more()}
          </Button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-bulk-add-source-items {
    display: flex;
    flex-direction: column;

    .items-list {
      margin-inline: calc(var(--drawer-padding) * -1);
    }

    .items-empty {
      padding: var(--gap-xl) var(--gap-m);
    }

    .items-more {
      display: flex;
      justify-content: center;
      gap: var(--gap-s);
      padding: var(--gap-m);
    }
  }
</style>
