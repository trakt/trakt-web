<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import type { CalendarEntry } from "../models/CalendarEntry";
  import CalendarItem from "./CalendarItem.svelte";
  import { dateKey } from "./dateKey";
  import NoItems from "./NoItems.svelte";
  import { syncScroll } from "./syncScroll";

  const {
    calendar,
    safeAreaOffset,
  }: {
    calendar: CalendarEntry[];
    safeAreaOffset: number;
  } = $props();
</script>

<div
  class="trakt-calendar-items"
  use:syncScroll={{ calendar, offset: safeAreaOffset }}
>
  {#each calendar as day (dateKey(day.date))}
    <div id={dateKey(day.date)}>
      <GridList
        title={toHumanDay(day.date, getLocale())}
        items={day.items}
        id={dateKey(day.date)}
      >
        {#snippet item(media)}
          <CalendarItem item={media} />
        {/snippet}

        {#snippet empty()}
          <NoItems />
        {/snippet}
      </GridList>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-calendar-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    --card-width: var(--ni-156);

    :global(.trakt-list-item-container) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--card-width), 1fr));

      gap: var(--gap-s);
    }

    :global(.trakt-card) {
      --width-card: var(--card-width);

      &:global(.trakt-card-cover-tag) {
        display: none;
      }
    }

    @include for-mobile() {
      :global(.trakt-list-item-container) {
        grid-template-columns: 1fr 1fr;
      }

      :global(.trakt-card) {
        --card-width: 100%;
      }
    }
  }
</style>
