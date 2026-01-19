<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import SeasonLabelTag from "$lib/components/media/tags/SeasonLabelTag.svelte";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { SeasonCardProps } from "./models/SeasonCardProps";

  const SCROLL_OFFSET = 8;

  const {
    season,
    media,
    urlBuilder,
    isCurrentSeason = false,
    variant = "default",
    style = "cover",
    popupActions,
    source,
  }: {
    urlBuilder: () => string;
    isCurrentSeason?: boolean;
  } & SeasonCardProps = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  const scrollToItem = (element: HTMLElement) => {
    if (!isCurrentSeason || variant === "list-item") return;

    const parent = element.parentElement;
    if (!parent) {
      return;
    }

    const parentRight = parent.scrollLeft + parent.clientWidth;
    const elementLeft = element.offsetLeft;
    const elementRight = elementLeft + element.offsetWidth;
    const isOutOfView = elementRight > parentRight;

    if (!isOutOfView) {
      return;
    }

    requestAnimationFrame(() => {
      parent.scrollTo({
        left: elementLeft - SCROLL_OFFSET,
        behavior: "instant",
      });
    });
  };
</script>

<div
  class="trakt-season-item"
  class:is-current-season={isCurrentSeason}
  data-variant={variant}
  use:scrollToItem
>
  {#if style === "cover"}
    <PortraitCard>
      {#if popupActions}
        <CardActionBar>
          {#snippet actions()}
            <PopupMenu
              label={m.button_label_popup_menu({
                title: seasonLabel(season.number),
              })}
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
      </Link>
      <CardFooter>
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

        {#snippet tag()}
          {#if variant === "list-item"}
            <TagBar>
              <SeasonLabelTag seasonNumber={season.number} />
            </TagBar>
          {/if}
        {/snippet}
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
