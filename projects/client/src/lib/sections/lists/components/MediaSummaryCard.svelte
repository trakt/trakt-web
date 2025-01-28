<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import MediaSummaryItem from "$lib/sections/summary/components/media/MediaSummaryItem.svelte";
  import type { MediaCardProps } from "./MediaCardProps";

  const { media, tags, action }: MediaCardProps = $props();
</script>

<Card
  --height-card="var(--height-summary-card)"
  --width-card="var(--width-summary-card)"
>
  <MediaSummaryItem {media} {tags} />
  <CardFooter {action} />
</Card>

<style>
  :global(.trakt-card .trakt-card-footer) {
    padding: 0;
  }

  :global(.trakt-card .trakt-summary-item) {
    padding: var(--ni-12);
  }
</style>
