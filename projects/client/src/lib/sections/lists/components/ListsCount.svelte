<script lang="ts">
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toLocaleNumber } from "$lib/utils/formatting/number/toLocaleNumber.ts";

  const {
    count,
    metaText,
  }: {
    count?: number;
    // Leading text rendered before the count (e.g. the discover mode).
    metaText?: string;
  } = $props();

  const displayCount = $derived.by(() => {
    if (count == null || count <= 0) {
      return undefined;
    }

    return toLocaleNumber(count, languageTag());
  });
</script>

<div class="trakt-lists-count">
  {#if metaText}
    <p class="bold meta-text">{metaText}</p>
  {/if}

  {#if displayCount != null}
    <div
      class="meta-item"
      title={m.text_list_count({ count: displayCount })}
    >
      <ListIcon size="small" />
      <p class="small">{displayCount}</p>
    </div>
  {/if}
</div>

<style>
  .trakt-lists-count {
    display: flex;
    align-items: center;
    min-width: 0;

    gap: var(--gap-s);
  }

  .meta-text {
    flex-shrink: 0;

    color: var(--list-meta-info-color);
  }

  .meta-item {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    gap: var(--gap-xxs);

    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
      flex-shrink: 0;
    }

    :global(p) {
      color: inherit;
    }
  }
</style>
