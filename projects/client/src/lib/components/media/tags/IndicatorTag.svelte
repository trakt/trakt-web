<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import FastRewindIcon from "$lib/components/icons/FastRewindIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const {
    variant = "full",
    indicator,
  }: {
    variant?: "partial" | "full";
    indicator: "watched" | "dropped" | "rewatching" | "watchlisted";
  } = $props();
</script>

{#snippet icon()}
  {#if indicator === "watched"}
    <TrackIcon />
  {:else if indicator === "dropped"}
    <DropIcon />
  {:else if indicator === "rewatching"}
    <FastRewindIcon />
  {:else}
    <BookmarkIcon state="added" />
  {/if}
{/snippet}

<trakt-indicator-tag data-variant={variant} data-indicator={indicator}>
  <StemTag
    --color-background-stem-tag="var(--color-background-indicator-tag)"
    --color-foreground-stem-tag="var(--color-text-indicator-tag)"
    --border-radius-tag="var(--border-radius-s)"
    {icon}
  />
</trakt-indicator-tag>

<style>
  trakt-indicator-tag {
    &[data-indicator="watchlisted"] {
      --glyph-scale: 1;
    }

    &[data-indicator="watched"] {
      --glyph-scale: 1.25;
    }

    &[data-indicator="dropped"] {
      --glyph-scale: 1.2;
    }

    &[data-indicator="rewatching"] {
      --glyph-scale: 1.6;
    }

    :global(.trakt-tag) {
      width: var(--ni-10);
      height: var(--ni-10);
      line-height: var(--ni-10);

      :global(trakt-tag-icon svg) {
        width: var(--ni-10);
        height: var(--ni-10);
        scale: var(--glyph-scale, 1);
      }
    }

    &[data-variant="partial"] {
      :global(.trakt-tag) {
        background: linear-gradient(
          to right,
          var(--color-background-stem-tag) 50%,
          var(--color-background-indicator-remainder-tag) 50%
        );
      }
    }
  }
</style>
