<script lang="ts">
  import type { YirDetail } from "$lib/requests/models/YirDetail";

  import Yir2024Hero from "./Yir2024Hero.svelte";
  import Yir2024PageInner from "./Yir2024PageInner.svelte";
  import Yir2024WatchedStats from "./Yir2024WatchedStats.svelte";

  const {
    detail,
    slug,
    year,
  }: {
    detail: YirDetail | null;
    slug: string;
    year: number;
  } = $props();
</script>

<section class="trakt-yir-2024-top-section" id="section-totals">
  <div class="yir-2024-top-gradient" aria-hidden="true"></div>

  <Yir2024PageInner>
    <div class="yir-2024-top-stack">
      <Yir2024Hero {slug} {year} {detail} />

      {#if detail}
        <Yir2024WatchedStats stats={detail.stats.all} {slug} />
      {/if}
    </div>
  </Yir2024PageInner>
</section>

<style lang="scss">
  .trakt-yir-2024-top-section {
    position: relative;
    padding: var(--ni-104) 0 0 0;
    overflow: hidden;
  }

  // Centered soft glow. The vertical radius is sized so the gradient reaches
  // full transparency right at the top and bottom edges — otherwise `overflow:
  // hidden` clips it mid-fade and leaves a hard purple seam where the section
  // meets the first-play card below.
  .yir-2024-top-gradient {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.35;
    background: radial-gradient(
      55% 50% at 50% 50%,
      var(--purple-700) 0%,
      color-mix(in srgb, var(--purple-700) 0%, transparent) 100%
    );
  }

  // Inner stack lifts above the gradient overlay and uses --content-gap so
  // children compose vertically without any of them setting their own margin.
  .yir-2024-top-stack {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--content-gap);
  }
</style>
