<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import { useMediaSpoiler } from "$lib/features/spoilers/useMediaSpoiler";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";

  const {
    title,
    children,
    ...target
  }: { title: string } & ChildrenProps & MediaStoreProps = $props();

  const { isSpoilerHidden } = $derived(useMediaSpoiler(target));
  const isExpanded = writable(false);

  // FIXME: i18n as design is finalized
</script>

{#snippet spoiler()}
  <button
    class="trakt-spoiler-section"
    aria-label={$isExpanded
      ? `Hide ${title} spoilers`
      : `View ${title} spoilers`}
    onclick={() => isExpanded.set(!$isExpanded)}
    class:is-expanded={$isExpanded}
  >
    <div class="trakt-spoiler-section-header">
      <p class="meta-info">
        {$isExpanded ? `Hide ${title}` : `View ${title}`}
      </p>
      <p class="meta-info">Spoiler alert <DropIcon /></p>
    </div>

    {#if $isExpanded}
      <div
        class="trakt-spoiler-section-content"
        transition:slide={{ duration: 150, axis: "y" }}
      >
        {@render children()}
      </div>
    {/if}
  </button>
{/snippet}

{#if $isSpoilerHidden}
  {@render spoiler()}
{:else}
  {@render children()}
{/if}

<style>
  .trakt-spoiler-section {
    all: unset;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    flex-direction: column;

    padding: var(--ni-8);
    padding-left: var(--ni-12);

    color: var(--color-foreground-red);
    background-color: var(--red-900);

    border-radius: var(--border-radius-xxl);
    border: var(--ni-2) solid var(--color-background-red);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color, border-color, border-radius;

    .trakt-spoiler-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .meta-info {
        display: flex;
        align-items: center;
        gap: var(--gap-xs);
      }

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
        transition: transform var(--transition-increment) ease-in-out;
      }
    }

    .trakt-spoiler-section-content {
      padding: var(--ni-8);
    }

    &.is-expanded {
      background-color: transparent;
      color: var(--color-foreground);
      border-color: var(--red-900);
      border-radius: var(--border-radius-l);

      .trakt-spoiler-section-header {
        :global(svg) {
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
