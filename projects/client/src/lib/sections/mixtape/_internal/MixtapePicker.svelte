<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import SkeletonCard from "$lib/sections/lists/components/SkeletonCard.svelte";
  import type { MixtapePickerProps } from "./MixtapePickerProps.ts";

  const { picker, isLoading, isFull, pickHref, onPick }: MixtapePickerProps =
    $props();

  const source = $derived(picker.kind === "search" ? "search" : "grid");
  const emptyText = $derived(
    picker.kind === "search"
      ? m.text_mixtape_no_search_results()
      : picker.kind === "fits"
        ? m.text_mixtape_no_fits()
        : m.text_mixtape_empty_history(),
  );
</script>

{#snippet differentMood()}
  <span class="small secondary ellipsis">{m.tag_mixtape_different_mood()}</span>
{/snippet}

<div class="trakt-mixtape-picker">
  {#if isFull}
    <p class="secondary">{m.text_mixtape_max_picks()}</p>
  {:else if isLoading}
    <div class="picker-skeleton">
      {#each Array.from({ length: 6 }, (_, index) => index) as index (index)}
        <SkeletonCard {index} listIndex={0} />
      {/each}
    </div>
  {:else if picker.items.length === 0}
    <p class="secondary">{emptyText}</p>
  {:else}
    <GridList
      id={`mixtape-picker-${picker.kind}`}
      items={picker.items.map((entry) => ({ ...entry, key: entry.media.key }))}
      sizing="auto"
      --width-item="var(--width-portrait-card)"
    >
      {#snippet item({ media, isOff })}
        {#if isOff}
          <DefaultMediaItem
            type={media.type}
            {media}
            popupActions={null}
            tag={differentMood}
            canDeemphasize
          />
        {:else}
          <DefaultMediaItem
            type={media.type}
            {media}
            popupActions={null}
            urlOverride={{ href: pickHref(media), noscroll: true }}
            onclick={() => onPick(source)}
          />
        {/if}
      {/snippet}
    </GridList>
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape-picker {
    .picker-skeleton {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-m);
      padding-inline: var(--layout-distance-side);
    }

    p {
      padding-inline: var(--layout-distance-side);
      max-width: var(--ni-520);
    }
  }
</style>
