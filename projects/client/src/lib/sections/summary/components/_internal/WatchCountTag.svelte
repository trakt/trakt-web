<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { linear } from "svelte/easing";
  import { slide } from "svelte/transition";

  const { count }: { count: number } = $props();

  const TRANSITION_DURATION = 300;
  // FIXME: replace the one in the tags folder when new design is leading
</script>

<watch-count-tag>
  <StemTag
    --color-background-stem-tag="var(--shade-10)"
    --color-foreground-stem-tag="var(--shade-920)"
  >
    <CheckIcon />

    {#key count}
      <p
        class="meta-info uppercase no-wrap counter"
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
    :global(.trakt-tag) {
      position: relative;
    }

    :global(.counter[inert]) {
      position: absolute;
      left: var(--ni-20);
    }
  }
</style>
