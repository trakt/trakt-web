<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import AirTimeTag from "$lib/components/media/tags/AirTimeTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { hasAired } from "$lib/utils/media/hasAired";
  import type { Snippet } from "svelte";
  import type { CalendarItem } from "./_internal/useCalendar";
  import CalendarMediaCard from "./CalendarMediaCard.svelte";

  type CalendarItemProps = {
    item: CalendarItem;
    variant?: "default" | "summary";
    source?: string;
    popupActions?: Snippet;
  };

  const {
    item,
    variant = "default",
    source = "calendar",
    popupActions: externalPopupActions,
  }: CalendarItemProps = $props();

  const isDropped = $derived(
    "show" in item ? useIsDropped(item.show).isDropped : undefined,
  );

  const hasEpisodeActions = $derived(
    hasAired(item) || !$isDropped || externalPopupActions,
  );
</script>

<trakt-calendar-item data-variant={variant}>
  {#if "show" in item}
    {#snippet popupActions()}
      {#if externalPopupActions}
        {@render externalPopupActions()}
      {:else}
        <RenderFor audience="authenticated">
          {#if hasAired(item)}
            <MarkAsWatchedAction
              style="dropdown-item"
              type="episode"
              title={item.title}
              show={item.show}
              media={item}
              mode="hybrid"
            />
          {/if}

          {#if !$isDropped}
            <DropAction
              style="dropdown-item"
              type="show"
              id={item.show.id}
              title={item.show.title}
            />
          {/if}
        </RenderFor>
      {/if}
    {/snippet}

    <EpisodeItem
      episode={item}
      media={item.show}
      variant={variant === "default" ? "upcoming" : "calendar"}
      {source}
      popupActions={hasEpisodeActions ? popupActions : undefined}
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
          releaseDate={item.effectiveReleaseDate}
          type="tag"
        />
      {/snippet}
    </EpisodeItem>
  {/if}

  {#if item.type === "movie"}
    <CalendarMediaCard
      media={item}
      type={item.type}
      {source}
      popupActions={externalPopupActions}
    />
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
