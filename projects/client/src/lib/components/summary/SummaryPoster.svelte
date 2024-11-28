<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";

  type SummaryPosterProps = {
    src: string;
    alt: string;
    actions?: Snippet;
  };

  const { src, alt, actions }: SummaryPosterProps = $props();
</script>

<div class="trakt-summary-poster">
  <CrossOriginImage {src} {alt} />

  {@render actions?.()}
</div>

<style>
  .trakt-summary-poster {
    width: var(--ni-320);
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    :global(img) {
      border-radius: var(--ni-24);
      align-self: stretch;
      width: var(--ni-320);
      height: var(--ni-480);

      box-shadow: 0px 7.673px 23.02px 0px rgba(0, 0, 0, 0.56);
    }
  }
</style>
