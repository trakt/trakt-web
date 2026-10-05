<script lang="ts">
  import DropdownCaretIcon from "$lib/components/dropdown/DropdownCaretIcon.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { clickOutside } from "$lib/utils/actions/clickOutside.ts";
  import type { BulkAddSourceSelectProps } from "./BulkAddSourceSelectProps.ts";

  const { sources, activeKey, pickedCounts, onSelect }: BulkAddSourceSelectProps =
    $props();

  let isOpen = $state(false);

  const activeSource = $derived(
    sources.find(({ key }) => key === activeKey) ?? sources.at(0),
  );
  const activePicked = $derived(pickedCounts[activeKey] ?? 0);

  const select = (key: string) => {
    isOpen = false;
    onSelect(key);
  };
</script>

{#snippet counts(count: number | undefined, picked: number)}
  <span class="source-counts">
    {#if picked > 0}
      <span class="source-picked bold">{picked}</span>
    {/if}
    {#if count != null}
      <span class="small secondary">{count}</span>
    {/if}
  </span>
{/snippet}

<div
  class="trakt-bulk-add-source-select"
  use:clickOutside
  onclickoutside={() => (isOpen = false)}
>
  <button
    type="button"
    class="source-trigger"
    aria-label={m.label_add_from_lists_source()}
    aria-haspopup="true"
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
  >
    <span class="bold ellipsis">{activeSource?.name}</span>
    {@render counts(activeSource?.count, activePicked)}
    <DropdownCaretIcon open={isOpen} />
  </button>

  {#if isOpen}
    <div class="source-menu">
      <DropdownGroup>
        {#each sources as source (source.key)}
          <DropdownItem
            style="flat"
            color="default"
            variant="secondary"
            selected={source.key === activeKey}
            onclick={() => select(source.key)}
          >
            {source.name}

            {#snippet end()}
              {@render counts(source.count, pickedCounts[source.key] ?? 0)}
            {/snippet}
          </DropdownItem>
        {/each}
      </DropdownGroup>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-bulk-add-source-select {
    position: relative;
    z-index: var(--layer-raised);

    .source-trigger {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      min-height: var(--ni-48);
      padding: 0 var(--gap-m);
      border-radius: var(--border-radius-m);
      background: var(--color-card-background);
      border: var(--ni-1) solid var(--color-option-list-border);

      display: flex;
      align-items: center;
      gap: var(--gap-s);
      cursor: pointer;

      > .ellipsis {
        flex: 1;
        min-width: 0;
      }

      &:focus-visible,
      &[aria-expanded="true"] {
        border-color: var(--purple-500);
      }
    }

    .source-counts {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .source-picked {
      min-width: var(--ni-18);
      height: var(--ni-18);
      padding-inline: var(--gap-xxs);
      box-sizing: border-box;
      border-radius: var(--border-radius-xxl);
      background: var(--purple-500);
      color: var(--shade-10);
      font-size: var(--font-size-tag);

      display: grid;
      place-items: center;
    }

    .source-menu {
      position: absolute;
      inset-inline: 0;
      inset-block-start: calc(100% + var(--gap-xs));
      max-height: 20rem;
      overflow-y: auto;
      border-radius: var(--border-radius-l);
      box-shadow: var(--shadow-dialog);
    }
  }
</style>
