<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { untrack } from "svelte";
  import type { BulkAddPick } from "./BulkAddPick.ts";
  import BulkAddSourceItems from "./BulkAddSourceItems.svelte";
  import BulkAddSourceSelect from "./BulkAddSourceSelect.svelte";
  import { togglePick } from "./togglePick.ts";
  import { useBulkAddSources } from "./useBulkAddSources.ts";
  import { useBulkAddToList } from "./useBulkAddToList.ts";
  import { useTargetListedKeys } from "./useTargetListedKeys.ts";

  const { list, onClose }: { list: MediaListSummary; onClose: () => void } =
    $props();

  const target = untrack(() => list);
  const { sources } = useBulkAddSources(target.id);
  const { listedKeys, isLoading: isLoadingListed } = useTargetListedKeys(
    target,
  );
  const { addPicks, isAdding } = useBulkAddToList(target);

  let picks = $state<BulkAddPick[]>([]);
  let pickedSourceKey = $state<string>();

  const effectivePicks = $derived(
    picks.filter(({ key }) => !$listedKeys.has(key)),
  );

  const activeSource = $derived(
    $sources.find(({ key }) => key === pickedSourceKey) ?? $sources.at(0),
  );
  const pickedCounts = $derived(
    effectivePicks.reduce<Record<string, number>>(
      (counts, { sourceKey }) => ({
        ...counts,
        [sourceKey]: (counts[sourceKey] ?? 0) + 1,
      }),
      {},
    ),
  );
  const listCount = $derived(Object.keys(pickedCounts).length);
  const isAddDisabled = $derived(
    effectivePicks.length === 0 || $isAdding || $isLoadingListed,
  );

  const add = async () => {
    await addPicks(effectivePicks);
    onClose();
  };
</script>

<Drawer
  {onClose}
  title={m.header_add_from_lists({ name: list.name })}
  metaInfo={m.text_add_from_lists_description()}
>
  <div class="trakt-bulk-add-drawer">
    {#if activeSource}
      <div class="bulk-add-source">
        <BulkAddSourceSelect
          sources={$sources}
          activeKey={activeSource.key}
          {pickedCounts}
          onSelect={(key) => (pickedSourceKey = key)}
        />
      </div>

      {#key activeSource.key}
        <BulkAddSourceItems
          source={activeSource}
          listName={list.name}
          listedKeys={$listedKeys}
          picks={effectivePicks}
          onTogglePick={(pick) => (picks = togglePick(picks, pick))}
        />
      {/key}
    {/if}
  </div>
  {#snippet footer()}
    <div class="trakt-bulk-add-footer">
    <div class="bar-summary">
      <p class="bold">
        {effectivePicks.length === 0
          ? m.text_nothing_selected()
          : m.text_titles_selected({ count: effectivePicks.length })}
      </p>
      <p class="small secondary">
        {listCount > 1
          ? m.text_selected_from_lists({ count: listCount })
          : m.text_pick_from_other_lists_hint()}
      </p>
    </div>

    <Button
      label={m.button_text_add_selected({ count: effectivePicks.length })}
      color="purple"
      disabled={isAddDisabled}
      onclick={add}
    >
      {effectivePicks.length === 0
        ? m.button_text_add_selected_none()
        : m.button_text_add_selected({ count: effectivePicks.length })}
    </Button>
  </div>
  {/snippet}
</Drawer>

<style lang="scss">
  .trakt-bulk-add-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-bulk-add-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
  }
</style>
