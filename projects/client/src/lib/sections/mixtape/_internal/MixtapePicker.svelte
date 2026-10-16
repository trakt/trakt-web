<script lang="ts">
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
    <div class="picker-grid">
      {#each Array.from({ length: 9 }, (_, index) => index) as index (index)}
        <div class="picker-cell">
          <SkeletonCard {index} listIndex={0} />
        </div>
      {/each}
    </div>
  {:else if picker.items.length === 0}
    <p class="secondary">{emptyText}</p>
  {:else}
    <div class="picker-grid" role="list">
      {#each picker.items as { media, isOff } (media.key)}
        <div class="picker-cell" role="listitem">
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
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-picker {
    .picker-grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(var(--width-portrait-card), 1fr)
      );
      gap: var(--gap-m) var(--gap-xs);
      padding-inline: var(--layout-distance-side);

      @include for-mobile {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .picker-cell {
      container-type: inline-size;
      min-width: 0;

      --width-override-card: 100%;
      --height-override-card-cover: calc(100cqi * 1.5);
      --height-override-card: calc(
        100cqi * 1.5 + var(--height-portrait-card) -
          var(--height-portrait-card-cover)
      );
    }

    p {
      padding-inline: var(--layout-distance-side);
      max-width: var(--ni-520);
    }
  }
</style>
