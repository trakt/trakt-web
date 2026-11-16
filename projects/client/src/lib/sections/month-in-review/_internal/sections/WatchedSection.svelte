<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import LedgerSection from "../layout/LedgerSection.svelte";
  import Tile from "../layout/Tile.svelte";
  import TileGrid from "../layout/TileGrid.svelte";
  import type { Review } from "$lib/sections/review/models/Review.ts";
  import PosterRow from "$lib/sections/review/PosterRow.svelte";
  import RateNudge from "$lib/sections/review/RateNudge.svelte";

  const { review }: { review: Review } = $props();

  const unrated = $derived(review.unrated ?? []);
</script>

<LedgerSection
  label={m.month_review_section_watched()}
  count={toHumanNumber(review.titles.length, getLocale())}
>
  <TileGrid>
    <Tile span={unrated.length > 0 ? 4 : 6}>
      <PosterRow titles={review.titles} />
    </Tile>
    {#if unrated.length > 0}
      <Tile span={2} variant="outlined">
        <RateNudge titles={unrated} />
      </Tile>
    {/if}
  </TileGrid>
</LedgerSection>
