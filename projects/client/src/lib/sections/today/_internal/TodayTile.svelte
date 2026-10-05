<script lang="ts">
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import type { TodayTileProps } from "./TodayTileProps.ts";

  const { label, onOpen, children }: TodayTileProps = $props();
</script>

<button class="trakt-today-tile" aria-label={label} onclick={onOpen}>
  <PortraitCard>
    {@render children()}
  </PortraitCard>
</button>

<style>
  .trakt-today-tile {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: start;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
</style>
