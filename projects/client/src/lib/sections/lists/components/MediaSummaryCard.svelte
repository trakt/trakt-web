<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import MediaSummaryItem from "$lib/sections/summary/components/media/MediaSummaryItem.svelte";
  import type { MediaCardProps } from "./MediaCardProps";

  const { media, tags, action }: MediaCardProps = $props();
</script>

<Card>
  <MediaSummaryItem {media} {tags} />
  <CardFooter {action} />
</Card>
