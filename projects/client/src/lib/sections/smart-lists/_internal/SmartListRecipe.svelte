<script lang="ts">
  import CountBadge from "$lib/components/badge/CountBadge.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListTarget } from "../models/ListTarget";
  import { toSmartListSourceLabel } from "$lib/sections/lists/smart/toSmartListSourceLabel";

  const { target, type, extraCount = 0 }: {
    target: ListTarget;
    type: DiscoverMode;
    extraCount?: number;
  } = $props();

  const { activeFilterCount } = useFilter();

  const filterCount = $derived($activeFilterCount + extraCount);

  const typeLabel = $derived.by(() => {
    switch (type) {
      case "movie":
        return m.button_text_movies();
      case "show":
        return m.button_text_shows();
      default:
        return null;
    }
  });
</script>

<div class="trakt-smart-list-recipe">
  <span class="bold ellipsis">{toSmartListSourceLabel(target)}</span>

  {#if typeLabel}
    <span class="separator" aria-hidden="true">·</span>
    <span class="bold ellipsis">{typeLabel}</span>
  {/if}

  {#if filterCount > 0}
    <CountBadge count={filterCount} label={m.button_label_filters()} />
  {/if}
</div>

<style>
  .trakt-smart-list-recipe {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    min-width: 0;
    color: var(--color-text-secondary);
  }
</style>
