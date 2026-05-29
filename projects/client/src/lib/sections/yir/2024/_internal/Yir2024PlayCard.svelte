<script lang="ts">
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail.ts";
  import Yir2024MediaCard from "./Yir2024MediaCard.svelte";

  type Yir2024PlayCardProps = {
    item: YirWatchedItem;
    playLabel: string;
    year: number;
  };

  const { item, playLabel, year }: Yir2024PlayCardProps = $props();
</script>

<section class="yir-2024-play-card">
  <Yir2024MediaCard {item} {playLabel} {year} />
</section>

<style lang="scss">
  .yir-2024-play-card {
    width: 100%;
  }
</style>
