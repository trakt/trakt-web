<script lang="ts">
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import type { CalendarItem } from "./_internal/useCalendar";
  import CalendarMediaCard from "./CalendarMediaCard.svelte";

  const {
    item,
    variant = "default",
  }: { item: CalendarItem; variant?: "default" | "summary" } = $props();
</script>

<trakt-calendar-item data-variant={variant}>
  {#if "show" in item}
    <EpisodeItem
      episode={item}
      media={item.show}
      variant={variant === "default" ? "upcoming" : "calendar"}
      source="calendar"
    />
  {/if}

  {#if item.type === "movie"}
    <CalendarMediaCard media={item} type={item.type} />
  {/if}
</trakt-calendar-item>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-calendar-item {
    display: contents;

    &[data-variant="summary"] {
      --calendar-item-width: var(--ni-200);

      :global(.trakt-card) {
        --width-card: var(--calendar-item-width);
      }

      @include for-tablet-sm {
        --calendar-item-width: var(--ni-156);
      }

      @include for-mobile() {
        --calendar-item-width: 100%;
      }
    }
  }
</style>
