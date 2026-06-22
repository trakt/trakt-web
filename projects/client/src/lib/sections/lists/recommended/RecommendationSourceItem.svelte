<script lang="ts">
  import type { RecommendationSource } from "$lib/requests/models/RecommendationSource.ts";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";

  const { source }: { source: RecommendationSource } = $props();
</script>

<div class="trakt-recommendation-source-item">
  <DefaultMediaItem
    type={source.mediaType}
    media={source.media}
    style="cover"
    source="recommendation-source"
    mode="standalone"
  />
</div>

<style>
  .trakt-recommendation-source-item {
    display: contents;

    :global(.trakt-card-footer) {
      display: none;
    }
  }
</style>
