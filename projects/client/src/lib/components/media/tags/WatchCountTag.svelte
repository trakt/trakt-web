<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { linear } from "svelte/easing";
  import { slide } from "svelte/transition";
  import type { TagIntl } from "./TagIntl";

  const { i18n, count }: { i18n: TagIntl; count: number } = $props();

  const TRANSITION_DURATION = 300;
</script>

<watch-count-tag>
  <StemTag
    --color-background-stem-tag="var(--color-background-watch-count-tag)"
    --color-foreground-stem-tag="var(--color-text-watch-count-tag)"
    classList="trakt-tag-label"
  >
    <p class="bold uppercase no-wrap">
      {i18n.watchCountLabel()}
    </p>
  </StemTag>

  <StemTag
    --color-background-stem-tag="var(--color-background-watch-count-tag)"
    --color-foreground-stem-tag="var(--color-text-watch-count-tag)"
    classList="trakt-tag-count"
  >
    {#key count}
      <p
        class="bold uppercase no-wrap counter"
        transition:slide={{
          easing: linear,
          axis: "y",
          duration: TRANSITION_DURATION,
        }}
      >
        {count}
      </p>
    {/key}
  </StemTag>
</watch-count-tag>

<style>
  watch-count-tag {
    display: flex;
    align-items: center;

    gap: var(--ni-1);

    :global(.trakt-tag-label .trakt-tag) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    :global(.trakt-tag-count .trakt-tag) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      min-width: var(--ni-12);

      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .counter:nth-child(2) {
    position: fixed;
  }
</style>
