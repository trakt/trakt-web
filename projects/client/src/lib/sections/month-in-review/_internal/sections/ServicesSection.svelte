<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import LedgerSection from "../layout/LedgerSection.svelte";
  import Tile from "../layout/Tile.svelte";
  import TileGrid from "../layout/TileGrid.svelte";
  import type { MonthReview } from "../models/MonthReview.ts";
  import BarList from "../parts/BarList.svelte";

  const {
    review,
    previousMonthName,
  }: {
    review: MonthReview;
    previousMonthName: string;
  } = $props();

  const deltaFormat = new Intl.NumberFormat(languageTag(), {
    signDisplay: "exceptZero",
  });

  const services = $derived(review.services ?? []);
</script>

{#if services.length > 0}
  <LedgerSection label={m.month_review_services()}>
    <TileGrid>
      <Tile>
        <BarList items={services}>
          {#snippet meta(service)}
            <span class="split">
              {#if service.shows}<ShowIcon />{service.shows}{/if}
              {#if service.movies}<MovieIcon />{service.movies}{/if}
            </span>
            {#if service.previous !== undefined && service.count !== service.previous}
              {@const delta = service.count - service.previous}
              <span
                class="delta bold"
                data-trend={delta > 0 ? "up" : "down"}
                title={m.month_review_vs_previous({ month: previousMonthName })}
              >
                {deltaFormat.format(delta)}
              </span>
            {/if}
          {/snippet}
        </BarList>
      </Tile>
    </TileGrid>
  </LedgerSection>
{/if}

<style>
  .delta {
    font-size: var(--font-size-text-small);
    font-variant-numeric: tabular-nums;

    &[data-trend="up"] {
      color: var(--green-500);
    }

    &[data-trend="down"] {
      color: var(--red-500);
    }
  }

  .split {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);
    font-size: var(--font-size-text-small);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
      margin-inline-start: var(--gap-xs);
    }
  }
</style>
