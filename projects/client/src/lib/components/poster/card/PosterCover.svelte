<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import type { CardCoverProps } from "$lib/components/card/CardCoverProps";

  const { src, alt, tags, isLoading }: CardCoverProps = $props();
</script>

<CardCover {src} {alt} {isLoading}>
  {#snippet tags()}
    {@render tags?.()}
  {/snippet}
</CardCover>
