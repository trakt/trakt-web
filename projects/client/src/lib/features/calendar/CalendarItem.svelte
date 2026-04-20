<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { hasAired } from "$lib/utils/media/hasAired";
  import type { CalendarItem } from "./_internal/useCalendar";
  import CalendarMediaCard from "./CalendarMediaCard.svelte";

  const {
    item,
    variant = "default",
  }: { item: CalendarItem; variant?: "default" | "summary" } = $props();
</script>

<trakt-calendar-item data-variant={variant}>
  {#if "show" in item}
    {#snippet popupActions()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          style="dropdown-item"
          type="episode"
          title={item.title}
          show={item.show}
          media={item}
          mode="hybrid"
        />
      </RenderFor>
    {/snippet}

    <EpisodeItem
      episode={item}
      media={item.show}
      variant={variant === "default" ? "upcoming" : "calendar"}
      source="calendar"
      popupActions={hasAired(item) ? popupActions : undefined}
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
