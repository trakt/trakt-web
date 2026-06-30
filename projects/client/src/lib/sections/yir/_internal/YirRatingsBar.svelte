<script lang="ts">
  import SegmentedBar from "$lib/components/charts/SegmentedBar.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirRatingCount } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";

  const {
    distribution,
    type,
  }: {
    distribution: YirRatingCount[];
    type: "shows" | "movies";
  } = $props();

  // FIXME(i18n): hardcoded English plurals per the YIR convention.
  function unit(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }

  // Per-rating colour: full viz purple at the top rating, fading to a neutral
  // gray at the lowest. The gradient encodes rating magnitude (an ordinal
  // scale), so it's passed as an explicit per-segment colour rather than the
  // SegmentedBar's categorical palette.
  function segColor(rating: number): string {
    const ratio = (rating - 1) / 9;
    return `color-mix(in srgb, var(--viz-1) ${ratio * 100}%, var(--shade-500))`;
  }

  // Compose the shared SegmentedBar SOT so the ratings distribution renders
  // identically to the genres breakdown (proportional bar on desktop, legend
  // list on mobile). Highest rating first (leftmost); only ratings the user
  // actually gave. maxSegments = 10 keeps every rating on the 1–10 scale as its
  // own segment (no "Other" bucket).
  const items = $derived(
    distribution
      .filter((datum) => datum.count > 0)
      .sort((a, b) => b.rating - a.rating)
      .map((datum) => ({
        label: `${toUserRating(datum.rating, getLocale())} ★`,
        value: datum.count,
        sublabel: `${formatNumber(datum.count)} ${unit(datum.count)}`,
        color: segColor(datum.rating),
      })),
  );
</script>

<div class="trakt-yir-ratings-bar">
  <SegmentedBar
    {items}
    label={m.yir_section_title_all_ratings()}
    maxSegments={10}
  />
</div>

<style lang="scss">
  .trakt-yir-ratings-bar {
    // The ratings bar always sits on the dark poster hero (both themes), but
    // SegmentedBar consumes the global --color-text-* tokens, which are dark in
    // light theme. Pin them to the poster foreground so the labels/legend stay
    // legible against the fanart.
    --color-text-primary: var(--color-yir-poster-foreground);
    --color-text-secondary: var(--shade-400);
  }
</style>
