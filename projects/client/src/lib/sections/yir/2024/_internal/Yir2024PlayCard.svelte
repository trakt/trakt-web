<script lang="ts">
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail";
  import Yir2024MediaCard from "./Yir2024MediaCard.svelte";

  const {
    item,
    headerLabel,
  }: {
    item: YirWatchedItem;
    headerLabel: string;
  } = $props();
</script>

<section class="yir-2024-play-card">
  <Yir2024MediaCard {item} {headerLabel} />
</section>

<style lang="scss">
  .yir-2024-play-card {
    width: 100%;
  }
</style>
