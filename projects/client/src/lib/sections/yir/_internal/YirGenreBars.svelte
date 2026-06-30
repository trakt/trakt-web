<script lang="ts">
  import SegmentedBar from "$lib/components/charts/SegmentedBar.svelte";
  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider.ts";
  import { m } from "$lib/paraglide/messages";
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail.ts";
  import { yirMediaUnit } from "./yirMediaUnit.ts";

  type YirGenreBarsProps = {
    type: "shows" | "movies";
    genres: YirGenresGroup;
    /** Retained for call-site compatibility; the segmented bar is shared now. */
    variant?: "default" | "filled";
  };

  const { type, genres }: YirGenreBarsProps = $props();

  // Compose the shared SegmentedBar SOT so YIR genres render identically to the
  // design-system primitive (categorical viz palette, gloss, alternating labels).
  const items = $derived(
    genres.genres.map((genre) => ({
      label: GenreIntlProvider.genre(genre.name),
      value: genre.count,
      sublabel: `${genre.count.toLocaleString()} ${
        yirMediaUnit(type, genre.count)
      }`,
    })),
  );
</script>

<SegmentedBar {items} label={m.yir_label_top_genres()} />
