<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import SummaryCardBackgroundImage from "./_internal/SummaryCardBackgroundImage.svelte";
  import SummaryCardBottomBar from "./_internal/SummaryCardBottomBar.svelte";
  import SummaryCardDetails from "./_internal/SummaryCardDetails.svelte";
  import SummaryCardRating from "./_internal/SummaryCardRating.svelte";
  import SummaryCardTitles from "./_internal/SummaryCardTitles.svelte";
  import type { EpisodeCardProps } from "./models/EpisodeCardProps";
  import type { MediaCardProps } from "./models/MediaCardProps";
  import type { SeasonCardProps } from "./models/SeasonCardProps";
  import type { SummaryCardLayout } from "./models/SummaryCardLayout";

  type EpisodeSummaryProps = {
    type: "episode";
  } & EpisodeCardProps;

  type SeasonSummaryProps = {
    type: "season";
  } & SeasonCardProps;

  type ItemCardProps =
    | MediaCardProps
    | EpisodeSummaryProps
    | SeasonSummaryProps;

  type SummaryCardProps = {
    contextualTag?: Snippet;
    badge?: Snippet;
    sortTag?: Snippet;
    layout?: SummaryCardLayout;
  } & DistributiveOmit<ItemCardProps, "badge" | "action">;

  const {
    tag: externalTag,
    badge,
    popupActions,
    media,
    source,
    contextualTag,
    sortTag,
    layout = "default",
    indicators,
    ...rest
  }: SummaryCardProps = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  // const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  // const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  const isCompact = $derived(layout === "compact");
  const isMinimal = $derived(layout === "minimal");

  // const hasMultiLineTitles = $derived(
  //   !isCompact && !isMinimal && ($isTabletLarge || $isDesktop),
  // );

  const isShowContext = $derived(
    rest.type === "episode" && "context" in rest && rest.context === "show",
  );

  const coverData = $derived.by(() => {
    if (rest.type === "episode") {
      const episodeCover = rest.episode.cover.url ?? EPISODE_COVER_PLACEHOLDER;
      const posterOverride = "coverUrl" in rest ? rest.coverUrl : undefined;

      return {
        background: !isMinimal ? episodeCover : undefined,
        poster: posterOverride ?? media.poster.url.thumb,
        title: rest.episode.title,
      };
    }

    return {
      background: media.cover.url.thumb,
      poster: media.poster.url.thumb,
      title: media.title,
    };
  });

  const ratedItem = $derived.by(() => {
    switch (rest.type) {
      case "movie":
      case "show":
        return media;
      case "season":
        return rest.season;
      case "episode":
        return rest.episode;
    }
  });

  const tag = $derived.by(() => {
    if (sortTag) {
      return;
    }

    return externalTag;
  });

  const dimensions = $derived.by(() => {
    if (layout === "default") {
      return {
        width: "var(--width-summary-card)",
        height: "var(--height-summary-card)",
        heightCover: "var(--height-summary-card-cover)",
      };
    }

    return {
      width: "var(--width-summary-card-compact)",
      height: "var(--height-summary-card-compact)",
      heightCover: "var(--height-summary-card-cover-compact)",
    };
  });

  const href = $derived(
    isShowContext && rest.type === "episode"
      ? UrlBuilder.episode(media.slug, rest.episode.season, rest.episode.number)
      : UrlBuilder.media(media.type, media.slug),
  );
</script>

<Card
  classList="trakt-summary-card trakt-summary-card-{layout}"
  --height-card={dimensions.height}
  --height-card-cover={dimensions.heightCover}
  --width-card={dimensions.width}
  --poster-aspect-ratio="0.6667"
>
  {#if popupActions}
    <CardActionBar variant={isCompact || isMinimal ? "standalone" : "default"}>
      {#snippet actions()}
        <PopupMenu
          label={m.button_label_popup_menu({ title: media.title })}
          mode="standalone"
        >
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  {#if coverData.background}
    <SummaryCardBackgroundImage
      src={coverData.background}
      alt={`Background for ${coverData.title}`}
    />
  {/if}

  <Link
    {href}
    onclick={() => source && track({ source, type: rest.type })}
    color="inherit"
  >
    <div class="trakt-summary-poster">
      <CardCover
        title={coverData.title}
        alt={`Poster for ${coverData.title}`}
        src={coverData.poster}
      />
      {#if indicators}
        <IndicatorTags>
          {@render indicators()}
        </IndicatorTags>
      {/if}
    </div>

    <!-- classList={hasMultiLineTitles ? "multi-line-titles" : ""} -->
    <SummaryCardDetails>
      <SummaryCardTitles {...rest} {media} />
    </SummaryCardDetails>
  </Link>

  <SummaryCardBottomBar {tag} {layout}>
    {#if sortTag}
      {@render sortTag()}
    {:else if badge}
      {@render badge()}
    {:else if rest.variant !== "activity" && rest.variant !== "next"}
      <SummaryCardRating item={ratedItem} />
    {/if}
  </SummaryCardBottomBar>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-summary-card) {
    :global(p.trakt-card-subtitle) {
      color: var(--color-text-secondary);
    }

    :global(.trakt-card-content),
    :global(.trakt-card-content > .trakt-link) {
      display: flex;
      flex-grow: 1;
      text-decoration: none;
    }

    :global(.trakt-link) {
      width: 100%;

      @include for-mouse() {
        &:hover {
          .trakt-card-title {
            text-decoration: underline;
            text-underline-offset: var(--ni-2);
            text-decoration-thickness: var(--ni-2);
            text-decoration-color: var(--color-link-active);
          }
        }
      }
    }
  }

  .trakt-summary-poster {
    --poster-width: calc(
      var(--height-summary-card-cover) * var(--poster-aspect-ratio)
    );

    height: var(--height-summary-card-cover);
    width: var(--poster-width);

    flex-shrink: 0;

    :global(.trakt-indicator-tags) {
      left: 0;
      width: var(--poster-width);
    }
  }

  :global(.trakt-summary-card-minimal),
  :global(.trakt-summary-card-compact) {
    .trakt-summary-poster {
      --padding-compact-poster: calc(
        (
            var(--height-summary-card-compact) - var(
                --height-summary-card-cover-compact
              )
          ) *
          0.5
      );
      --poster-width: calc(
        var(--height-summary-card-cover-compact) * var(--poster-aspect-ratio)
      );

      padding: var(--padding-compact-poster);

      height: var(--height-summary-card-compact);
    }
  }
</style>
