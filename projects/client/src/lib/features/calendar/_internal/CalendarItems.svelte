<script lang="ts" generics="T extends { key: string }">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import type { Snippet } from "svelte";
  import { dateKey } from "./dateKey";
  import EmptyPeriod from "./EmptyPeriod.svelte";

  const {
    calendar,
    item,
    layout,
    empty,
  }: {
    calendar: { date: Date; items: T[] }[];
    item: Snippet<[T]>;
    layout: "list" | "grid";
    empty?: Snippet;
  } = $props();

  const isEmpty = $derived(calendar.every((day) => day.items.length === 0));
</script>

<div class="trakt-calendar-items" data-layout={layout}>
  {#if isEmpty}
    <EmptyPeriod />
  {:else}
    {#each calendar as day (dateKey(day.date))}
      {#if empty ?? day.items.length > 0}
        <div id={dateKey(day.date)} class="calendar-day-anchor">
          <GridList
            title={toHumanDay(day.date, getLocale())}
            items={day.items}
            id={dateKey(day.date)}
            {item}
            {empty}
          />
        </div>
      {/if}
    {/each}
  {/if}
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

    @include for-mobile() {
      &[data-layout="grid"] {
        :global(.trakt-list-item-container) {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
      }
    }
  }
</style>
