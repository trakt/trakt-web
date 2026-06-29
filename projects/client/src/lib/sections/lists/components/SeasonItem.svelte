<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import SeasonLabelTag from "$lib/components/media/tags/SeasonLabelTag.svelte";
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { scrollActiveItemIntoView } from "$lib/utils/actions/scrollActiveItemIntoView";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import type { Snippet } from "svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { SeasonCardProps } from "./models/SeasonCardProps";
  import StatusIndicators from "./StatusIndicators.svelte";

  const {
    season,
    media,
    urlBuilder,
    isCurrentSeason = false,
    variant = "default",
    style = "cover",
    popupActions,
    source,
    sortTag,
  }: {
    urlBuilder: () => string;
    isCurrentSeason?: boolean;
    sortTag?: Snippet;
  } & SeasonCardProps = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  const { isWatched, isPartiallyWatched } = $derived(
    useIsWatched({ type: "season", media: season, show: media }),
  );

  const scrollToItem = (element: HTMLElement, active: boolean) => {
    if (variant === "list-item") return;
    return scrollActiveItemIntoView(element, active);
  };
</script>

{#snippet indicatorTags()}
  <StatusIndicators
    isWatched={$isWatched}
    isPartiallyWatched={$isPartiallyWatched}
    isWatchlisted={false}
  />
{/snippet}

<div
  class="trakt-season-item"
  class:is-current-season={isCurrentSeason}
  data-variant={variant}
  use:scrollToItem={isCurrentSeason}
>
  {#if style === "cover"}
    {#snippet tag()}
      <TagBar>
        <SeasonLabelTag seasonNumber={season.number} />
      </TagBar>
    {/snippet}

    <PortraitCard>
      {#if popupActions}
        <CardActionBar>
          {#snippet actions()}
            <PopupMenu
              label={m.button_label_popup_menu({
                title: seasonLabel(season.number),
              })}
              title={seasonLabel(season.number)}
            >
              {#snippet items()}
                {@render popupActions()}
              {/snippet}
            </PopupMenu>
          {/snippet}
        </CardActionBar>
      {/if}

      <Link
        focusable={false}
        href={urlBuilder()}
        onclick={() => source && track({ source, type: "season" })}
        noscroll
      >
        <CardCover
          title={seasonLabel(season.number)}
          src={season.poster?.url.medium ?? media.poster.url.medium}
          alt={seasonLabel(season.number)}
        />

        <IndicatorTags>
          {@render indicatorTags()}
        </IndicatorTags>
      </Link>
      <CardFooter tag={variant === "list-item" ? tag : undefined}>
        {#if variant === "default"}
          <p
            use:lineClamp={{ lines: 2 }}
            class="trakt-season-title"
            class:trakt-card-title={isCurrentSeason}
            class:trakt-card-subtitle={!isCurrentSeason}
          >
            {seasonLabel(season.number)}
          </p>
        {/if}
      </CardFooter>
    </PortraitCard>
  {/if}

  {#if style === "summary"}
    <MediaSummaryCard
      type="season"
      {season}
      {source}
      {media}
      {style}
      {popupActions}
      {sortTag}
      indicators={indicatorTags}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-season-title {
    line-height: var(--ni-16);
  }

  .trakt-season-item {
    -webkit-tap-highlight-color: transparent;

    cursor: pointer;
    transition: opacity var(--transition-increment) ease-in-out;

    &[data-variant="default"] {
      &:not(.is-current-season) {
        opacity: var(--de-emphasized-opacity);

        @include for-mouse() {
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
