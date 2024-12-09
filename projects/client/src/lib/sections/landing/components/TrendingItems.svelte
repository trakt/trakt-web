<script lang="ts">
  import { useTrendingItems } from "../useTrendingItems";
  import Phones from "./Phones.svelte";
  import TrendingMedia from "./TrendingMedia.svelte";

  const { shows, movie, show } = $derived(useTrendingItems());
</script>

<div class="trakt-landing-preview">
  <div class="trakt-landing-media-wrapper">
    {#each $shows as show}
      <TrendingMedia type="show" trendingItem={show} />
    {/each}
  </div>
  <div class="trakt-landing-phones">
    <Phones />
  </div>
  <div class="trakt-landing-media-wrapper">
    <TrendingMedia type="show" trendingItem={$show} />
    <TrendingMedia type="movie" trendingItem={$movie} />
  </div>
</div>

<style>
  .trakt-landing-preview {
    display: grid;
    grid-template-columns: 1fr minmax(0, 1fr) 1fr;
    position: relative;
    margin-top: var(--ni-112);
    gap: var(--ni-24);
    container-type: inline-size;

    .trakt-landing-media-wrapper {
      z-index: 2;
      display: grid;
      width: 100%;
      justify-content: center;
      gap: var(--ni-16);

      :global(.trakt-preview-item:first-child) {
        margin-left: var(--ni-56);
      }
    }

    .trakt-landing-phones {
      display: flex;
      align-items: center;
      z-index: 1;
    }
  }
</style>
