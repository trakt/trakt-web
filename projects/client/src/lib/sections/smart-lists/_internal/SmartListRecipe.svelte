<script lang="ts">
  import CountBadge from "$lib/components/badge/CountBadge.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListTarget } from "../models/ListTarget";
  import { toTargetLabel } from "./toTargetLabel";

  const { target, type }: { target: ListTarget; type: DiscoverMode } = $props();

  const { activeFilterCount } = useFilter();

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
  <span class="bold ellipsis">{toTargetLabel(target)}</span>

  {#if typeLabel}
    <span class="separator" aria-hidden="true">·</span>
    <span class="bold ellipsis">{typeLabel}</span>
  {/if}

  {#if $activeFilterCount > 0}
    <CountBadge count={$activeFilterCount} label={m.button_label_filters()} />
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
