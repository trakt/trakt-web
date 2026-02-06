<script lang="ts" generics="T extends { key: string }">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import type { Snippet } from "svelte";
  import { dateKey } from "./dateKey";
  import NoItems from "./NoItems.svelte";

  const {
    calendar,
    item,
    cardWidth = "var(--ni-200)",
  }: {
    calendar: { date: Date; items: T[] }[];
    item: Snippet<[T]>;
    cardWidth?: string;
  } = $props();
</script>

<div class="trakt-calendar-items" style="--card-width: {cardWidth}">
  {#each calendar as day (dateKey(day.date))}
    <div id={dateKey(day.date)} class="calendar-day-anchor">
      <GridList
        title={toHumanDay(day.date, getLocale())}
        items={day.items}
        id={`${dateKey(day.date)}`}
        {item}
      >
        {#snippet empty()}
          <NoItems />
        {/snippet}
      </GridList>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-day-anchor {
    scroll-margin-top: var(--calendar-nav-bottom, 0px);
  }

  .trakt-calendar-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    :global(.trakt-list-item-container) {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      gap: var(--gap-s);
    }

    :global(.trakt-card) {
      --width-card: var(--card-width);

      :global(.trakt-card-cover-tag) {
        display: none;
      }
    }

    @include for-tablet-sm {
      --card-width: var(--ni-156);
    }

    @include for-mobile() {
      :global(.trakt-list-item-container) {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      :global(.trakt-card) {
        --card-width: 100%;
      }
    }
  }
</style>
