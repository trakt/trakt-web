<script lang="ts">
  import SegmentedBar from "$lib/components/charts/SegmentedBar.svelte";
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail.ts";

  type YirGenreBarsProps = {
    type: "shows" | "movies";
    genres: YirGenresGroup;
    /** Retained for call-site compatibility; the segmented bar is shared now. */
    variant?: "default" | "filled";
  };

  const { type, genres }: YirGenreBarsProps = $props();

  const unit = $derived(type === "shows" ? "show" : "movie");

  // Compose the shared SegmentedBar SOT so YIR genres render identically to the
  // design-system primitive (categorical viz palette, gloss, alternating labels).
  const items = $derived(
    genres.genres.map((genre) => ({
      label: genre.name,
      value: genre.count,
      sublabel: `${genre.count.toLocaleString()} ${
        genre.count === 1 ? unit : `${unit}s`
      }`,
    })),
  );
</script>

<SegmentedBar {items} label="Top genres" />
