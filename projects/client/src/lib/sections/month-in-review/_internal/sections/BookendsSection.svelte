<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import LedgerSection from "../layout/LedgerSection.svelte";
  import Tile from "../layout/Tile.svelte";
  import TileGrid from "../layout/TileGrid.svelte";
  import type { MonthReview } from "../models/MonthReview.ts";
  import PlayCard from "../parts/PlayCard.svelte";

  const { review }: { review: MonthReview } = $props();

  const span = $derived(review.firstPlay && review.lastPlay ? 3 : 6);
</script>

{#if review.firstPlay || review.lastPlay}
  <LedgerSection label={m.month_review_section_bookends()}>
    <TileGrid>
      {#if review.firstPlay}
        <Tile {span}>
          <PlayCard
            play={review.firstPlay}
            label={m.month_review_first_play()}
          />
        </Tile>
      {/if}
      {#if review.lastPlay}
        <Tile {span}>
          <PlayCard play={review.lastPlay} label={m.month_review_last_play()} />
        </Tile>
      {/if}
    </TileGrid>
  </LedgerSection>
{/if}
