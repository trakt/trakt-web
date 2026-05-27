<script lang="ts" generics="T extends { key: string }">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import type { Snippet } from "svelte";
  import CalendarDayHeader from "./CalendarDayHeader.svelte";
  import { dateKey } from "./dateKey";

  const {
    calendar,
    item,
    layout,
    order = "chronological",
    empty,
  }: {
    calendar: { date: Date; items: T[] }[];
    item: Snippet<[T]>;
    empty: Snippet;
    layout: "list" | "grid";
    order?: "chronological" | "reverse-chronological";
  } = $props();

  const isEmpty = $derived(calendar.every((day) => day.items.length === 0));
  const orderedCalendar = $derived(
    order === "chronological" ? calendar : calendar.toReversed(),
  );
</script>

<div class="trakt-calendar-items" data-layout={layout}>
  {#if isEmpty}
    {@render empty()}
  {:else}
    {#each orderedCalendar as day (dateKey(day.date))}
      {#if day.items.length > 0}
        <div id={dateKey(day.date)} class="calendar-day-anchor">
          <CalendarDayHeader date={day.date} count={day.items.length} />
          <GridList items={day.items} id={dateKey(day.date)} {item} />
        </div>
      {/if}
    {/each}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .calendar-day-anchor {
    scroll-margin-top: var(--calendar-nav-bottom, 0px);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
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
