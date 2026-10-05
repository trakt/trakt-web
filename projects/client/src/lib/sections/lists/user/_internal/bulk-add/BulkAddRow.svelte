<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { BulkAddItem } from "./BulkAddItem.ts";

  type BulkAddRowProps = {
    item: BulkAddItem;
    isPicked: boolean;
    isInList: boolean;
    onToggle: () => void;
  };

  const { item, isPicked, isInList, onToggle }: BulkAddRowProps = $props();
</script>

<button
  type="button"
  class="trakt-bulk-add-row"
  class:is-picked={isPicked}
  class:is-in-list={isInList}
  aria-pressed={isPicked}
  disabled={isInList}
  onclick={onToggle}
>
  <CrossOriginImage
    classList="bulk-add-poster"
    src={item.posterUrl}
    alt=""
    animate={false}
  />

  <div class="row-label">
    <p class="bold ellipsis">{item.title}</p>
    <p class="small secondary">{item.year}</p>
  </div>

  {#if isInList}
    <p class="small secondary">{m.text_already_in_list()}</p>
  {:else}
    <span class="row-check" aria-hidden="true">
      {#if isPicked}<CheckIcon />{/if}
    </span>
  {/if}
</button>

<style lang="scss">
  .trakt-bulk-add-row {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    min-height: var(--ni-72);
    padding: var(--gap-xxs) var(--drawer-padding);

    display: flex;
    align-items: center;
    gap: var(--gap-m);

    cursor: pointer;
    transition: background var(--transition-increment) ease-in-out;

    &:focus-visible {
      outline: var(--ni-2) solid var(--purple-500);
      outline-offset: calc(var(--ni-2) * -1);
    }

    &.is-picked {
      background: color-mix(in srgb, var(--purple-500) 13%, transparent);
    }

    &.is-in-list {
      cursor: default;

      .row-label,
      :global(.bulk-add-poster) {
        opacity: 0.45;
      }
    }

    :global(.bulk-add-poster) {
      flex-shrink: 0;
      width: var(--ni-44);
      height: var(--ni-66);
      object-fit: cover;
      border-radius: var(--border-radius-xs);
    }

    .row-label {
      flex: 1;
      min-width: 0;
    }

    .row-check {
      flex-shrink: 0;
      width: var(--ni-22);
      height: var(--ni-22);
      box-sizing: border-box;
      border-radius: 50%;
      border: var(--ni-2) solid var(--color-text-secondary);

      display: grid;
      place-items: center;
      color: var(--shade-10);
    }

    &.is-picked .row-check {
      background: var(--purple-500);
      border-color: var(--purple-500);
    }
  }
</style>
