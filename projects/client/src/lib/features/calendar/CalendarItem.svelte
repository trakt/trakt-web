<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import AirTimeTag from "$lib/components/media/tags/AirTimeTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
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
    >
      {#snippet tag()}
        {#if variant === "summary"}
          <AirTimeTag airDate={item.airDate} />
        {:else}
          <AirDateTag
            i18n={TagIntlProvider}
            airDate={item.effectiveReleaseDate}
            type="tag"
          />
        {/if}
        <EpisodeStatusTag
          i18n={EpisodeIntlProvider}
          episodeType={item.type}
          type="tag"
        />
      {/snippet}
    </EpisodeItem>
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
