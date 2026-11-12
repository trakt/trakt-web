<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import LedgerSection from "../layout/LedgerSection.svelte";
  import Tile from "../layout/Tile.svelte";
  import TileGrid from "../layout/TileGrid.svelte";
  import type { MonthReview } from "../models/MonthReview.ts";
  import RankedList from "../parts/RankedList.svelte";
  import RateNudge from "../parts/RateNudge.svelte";

  const { review }: { review: MonthReview } = $props();

  const topRated = $derived(review.topRated ?? []);
  const unrated = $derived(review.unrated ?? []);
</script>

{#if topRated.length > 0 || unrated.length > 0}
  <LedgerSection
    label={m.month_review_section_ratings()}
    count={review.ratingsCount === undefined
      ? undefined
      : toHumanNumber(review.ratingsCount, getLocale())}
  >
    <TileGrid>
      {#if topRated.length > 0}
        <Tile span={unrated.length > 0 ? 4 : 6}>
          <h3>{m.month_review_top_rated()}</h3>
          <div class="columns">
            <RankedList
              titles={topRated}
              layout={unrated.length === 0 ? "grid" : "list"}
            >
              {#snippet trailing(title)}
                {#if title.rating !== undefined}
                  <UserRating rating={title.rating} />
                {/if}
              {/snippet}
            </RankedList>
          </div>
        </Tile>
      {/if}
      {#if unrated.length > 0}
        <Tile span={topRated.length > 0 ? 2 : 6} variant="outlined">
          <RateNudge titles={unrated} />
        </Tile>
      {/if}
    </TileGrid>
  </LedgerSection>
{/if}

<style>
  h3 {
    margin: 0;
    font-size: var(--font-size-title);
  }
</style>
