<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { toRelativeHumanDay } from "$lib/utils/formatting/date/toRelativeHumanDay";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { episodeSubtitle } from "$lib/utils/intl/episodeSubtitle";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import SummaryCardBackgroundImage from "./_internal/SummaryCardBackgroundImage.svelte";
  import SummaryCardBottomBar from "./_internal/SummaryCardBottomBar.svelte";
  import SummaryCardDetails from "./_internal/SummaryCardDetails.svelte";
  import SummaryCardRating from "./_internal/SummaryCardRating.svelte";
  import type { EpisodeCardProps } from "./models/EpisodeCardProps";
  import type { MediaCardProps } from "./models/MediaCardProps";
  import type { SeasonCardProps } from "./models/SeasonCardProps";

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
    sortTag?: Snippet;
    badge?: Snippet;
  } & DistributiveOmit<ItemCardProps, "badge" | "action">;

  const {
    tag,
    badge,
    popupActions,
    media,
    source,
    sortTag,
    contextualTag,
    ...rest
  }: SummaryCardProps = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  const hasMultiLineTitles = $derived($isTabletLarge || $isDesktop);

  const coverData = $derived({
    background:
      rest.type === "episode"
        ? (rest.episode.cover.url ?? EPISODE_COVER_PLACEHOLDER)
        : media.cover.url.thumb,
    poster: media.poster.url.thumb,
    title: rest.type === "episode" ? rest.episode.title : media.title,
  });

  const indicators = $derived.by(() => {
    if (rest.type !== "movie" && rest.type !== "show") {
      return;
    }

    return rest.indicators;
  });
</script>

<Card
  classList="trakt-summary-card"
  --height-card="var(--height-summary-card)"
  --height-card-cover="var(--height-summary-card-cover)"
  --width-card="var(--width-summary-card)"
  --poster-aspect-ratio="0.6667"
>
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.button_label_popup_menu({ title: media.title })}>
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  <SummaryCardBackgroundImage
    src={coverData.background}
    alt={`Background for ${coverData.title}`}
  />

  <Link
    href={UrlBuilder.media(media.type, media.slug)}
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

    <SummaryCardDetails
      classList={hasMultiLineTitles ? "multi-line-titles" : ""}
      {tag}
    >
      {#if rest.type === "season"}
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
        <p class="trakt-card-subtitle secondary ellipsis">
          {seasonLabel(rest.season.number)}
        </p>
      {:else if rest.variant === "activity"}
        {#if rest.type === "episode"}
          <p class="trakt-card-title ellipsis">
            {episodeSubtitle(rest.episode)}
            {#if !["multiple_episodes", "full_season"].includes(rest.episode.type)}
              <Spoiler media={rest.episode} show={media} type="episode">
                - {rest.episode.title}
              </Spoiler>
            {/if}
          </p>
        {:else}
          <p class="trakt-card-title ellipsis">
            {media.title}
          </p>
        {/if}
        <p class="trakt-card-subtitle secondary ellipsis">
          {toRelativeHumanDay(new Date(), rest.date, getLocale())}
        </p>
      {:else if rest.type === "episode" || (rest.variant === "start" && "episode" in rest)}
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
        <p class="trakt-card-subtitle secondary ellipsis">
          {episodeNumberLabel({
            seasonNumber: rest.episode.season,
            episodeNumber: rest.episode.number,
          })}
          <Spoiler media={rest.episode} show={media} type="episode">
            - {rest.episode.title}
          </Spoiler>
        </p>
      {:else if rest.variant === "credit"}
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
        <p class="trakt-card-subtitle secondary ellipsis">
          {rest.role}
        </p>
      {:else}
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
        <GenreList
          classList="trakt-card-subtitle smaller ellipsis secondary"
          separator=", "
          genres={media.genres}
        />
      {/if}
      {#if sortTag}
        <p class="trakt-card-subtitle">
          {@render sortTag()}
        </p>
      {/if}
    </SummaryCardDetails>
  </Link>

  <SummaryCardBottomBar {contextualTag} {tag}>
    {@render badge?.()}

    {#if !badge && rest.variant !== "activity" && rest.variant !== "next"}
      <SummaryCardRating
        item={rest.type === "episode" ? rest.episode : media}
      />
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

  :global(.trakt-summary-card-titles) {
    height: var(--ni-66);
  }

  .trakt-card-title,
  .trakt-card-subtitle,
  :global(.trakt-card-subtitle) {
    padding-right: var(--ni-18);
  }

  :global(.multi-line-titles) {
    .trakt-card-title,
    .trakt-card-subtitle,
    :global(.trakt-card-subtitle) {
      display: -webkit-box;

      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      white-space: initial;
      overflow: hidden;
    }
  }

  .trakt-card-title {
    font-size: var(--font-size-text);

    @include for-tablet-sm-and-below {
      font-size: var(--font-size-title);
    }
  }
</style>
