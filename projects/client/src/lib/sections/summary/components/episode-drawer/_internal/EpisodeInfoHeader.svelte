<script lang="ts">
  import { goto } from "$app/navigation";
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import { mapToMainCredit } from "$lib/sections/summary/components/_internal/mapToMainCredit";
  import StemSwipeIndicator from "$lib/sections/media-actions/_internal/StemSwipeIndicator.svelte";
  import SocialActivitiesButton from "$lib/sections/summary/components/_internal/SocialActivitiesButton.svelte";
  import SpoilerSection from "$lib/sections/summary/components/_internal/SpoilerSection.svelte";
  import EpisodeActions from "$lib/sections/summary/components/episode/v2/EpisodeActions.svelte";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { fade } from "svelte/transition";
  import EpisodeInfoPoster from "./EpisodeInfoPoster.svelte";
  import { useEpisodeRating } from "./useEpisodeRating.ts";

  const {
    show,
    seasons,
    season,
    episode,
    entry,
    crew,
    isCrewLoading,
    socialTarget,
    socialTitle,
    onRatingsOpen,
    onSocialOpen,
  }: {
    show: ShowEntry;
    seasons: Season[];
    season: number;
    episode: number;
    entry: EpisodeEntry | Nil;
    crew: MediaCrew;
    isCrewLoading: boolean;
    socialTarget: MediaSocialQueryTarget;
    socialTitle: string;
    onRatingsOpen: () => void;
    onSocialOpen: () => void;
  } = $props();

  // The ratings query only needs the slug/season/episode numbers, so it can
  // resolve independently of the episode summary entry.
  const params$ = fromRune(() => ({
    slug: show.slug,
    season,
    episode,
  }));

  const { ratings, isLoading: isRatingLoading } = useEpisodeRating(params$);

  const { buildEpisodeDrawerLink } = summaryDrawerNavigation();

  // Seasons that actually have episodes, ordered so previous/next can
  // cross season boundaries instead of clamping to the current season.
  const orderedSeasons = $derived(
    seasons
      .filter((s) => s.episodes.count > 0)
      .sort((a, b) => a.number - b.number),
  );

  const currentIndex = $derived(
    orderedSeasons.findIndex((s) => s.number === season),
  );

  const currentSeasonCount = $derived(
    orderedSeasons.at(currentIndex)?.episodes.count ?? 0,
  );

  const previousTarget = $derived.by(() => {
    if (episode > 1) {
      return { season, episode: episode - 1 };
    }

    const previousSeason =
      currentIndex > 0 ? orderedSeasons.at(currentIndex - 1) : undefined;

    return previousSeason
      ? {
          season: previousSeason.number,
          episode: previousSeason.episodes.count,
        }
      : undefined;
  });

  const nextTarget = $derived.by(() => {
    if (episode < currentSeasonCount) {
      return { season, episode: episode + 1 };
    }

    const nextSeason =
      currentIndex >= 0 ? orderedSeasons.at(currentIndex + 1) : undefined;

    return nextSeason ? { season: nextSeason.number, episode: 1 } : undefined;
  });

  const previousEpisodeLink = $derived(
    previousTarget ? buildEpisodeDrawerLink(previousTarget) : undefined,
  );

  const nextEpisodeLink = $derived(
    nextTarget ? buildEpisodeDrawerLink(nextTarget) : undefined,
  );

  const genre = $derived(show.genres.at(0));

  const subtitle = $derived(
    entry
      ? [
          toHumanDate(new Date(), entry.airDate, getLocale()),
          toHumanDuration({ minutes: entry.runtime }, languageTag()),
          show.certification,
          genre ? toTranslatedGenre(genre) : undefined,
        ]
          .filter(Boolean)
          .join(" • ")
      : undefined,
  );

  const mainCredit = $derived(mapToMainCredit("episode", crew));
  const creditSeparator = ", ";

  const fadeIn = { duration: 150 } as const;

  const isTouch = useMedia(WellKnownMediaQuery.touch);

  // Touch devices: swiping the cover mirrors the prev/next buttons. Swipe right ->
  // previous episode, swipe left -> next. Missing targets are a no-op and the
  // indicator stays inactive so the swipe reads as disabled.
  const swipeToEpisode = (direction: "left" | "right") => {
    const link = direction === "right" ? previousEpisodeLink : nextEpisodeLink;
    if (!link) {
      return;
    }

    goto(link.href, { replaceState: true, noScroll: true });
  };
</script>

{#snippet cover()}
  {#if entry}
    <EpisodeInfoPoster {show} episode={entry} />
  {:else}
    <div class="skeleton-cover">
      <div class="skeleton-cover-inner">
        <Skeleton height="100%" radius="var(--border-radius-xxl)" />
      </div>
    </div>
  {/if}
{/snippet}

<div class="episode-info-header">
  <div class="episode-info-poster-ratings">
    {#if $isTouch}
      <SwipeX
        children={cover}
        directions={["left", "right"]}
        classList="episode-cover-swipe"
        onSwipe={(state) =>
          swipeToEpisode(state.direction === "right" ? "right" : "left")}
      >
        {#snippet indicator({ isActive, direction })}
          {#if direction === "right"}
            <StemSwipeIndicator
              {isActive}
              disabled={previousEpisodeLink == null}
              --color-gesture-active="var(--color-foreground)"
            >
              <CaretLeftIcon />
            </StemSwipeIndicator>
          {/if}

          {#if direction === "left"}
            <StemSwipeIndicator
              {isActive}
              disabled={nextEpisodeLink == null}
              --color-gesture-active="var(--color-foreground)"
            >
              <CaretRightIcon />
            </StemSwipeIndicator>
          {/if}
        {/snippet}
      </SwipeX>
    {:else}
      {@render cover()}
    {/if}

    <div class="episode-info-ratings">
      {#if entry}
        <div in:fade={fadeIn}>
          <RatingList
            ratings={$ratings}
            {entry}
            isLoading={$isRatingLoading}
            onDrilldown={onRatingsOpen}
          />
        </div>
      {:else}
        <div class="skeleton-ratings">
          <Skeleton width="var(--ni-64)" height="var(--ni-28)" />
          <Skeleton width="var(--ni-64)" height="var(--ni-28)" />
        </div>
      {/if}
    </div>
  </div>

  <div class="episode-info-switcher">
    {#if previousEpisodeLink}
      <Link {...previousEpisodeLink} label={m.button_label_previous_episode()}>
        <CaretLeftIcon />
      </Link>
    {:else}
      <span class="episode-switcher-spacer"></span>
    {/if}

    <span class="bold">
      {m.text_season_episode_number({ season, number: episode })}
    </span>

    {#if nextEpisodeLink}
      <Link {...nextEpisodeLink} label={m.button_label_next_episode()}>
        <CaretRightIcon />
      </Link>
    {:else}
      <span class="episode-switcher-spacer"></span>
    {/if}
  </div>

  <div class="episode-info-meta">
    <div class="episode-info-meta-line">
      {#if subtitle != null}
        <p class="secondary small" in:fade={fadeIn}>{subtitle}</p>
      {:else}
        <Skeleton width="var(--ni-220)" height="var(--ni-14)" />
      {/if}
    </div>

    <!-- Always reserved: not every episode has a director, so the line keeps
         its height whether it holds a credit, a skeleton, or nothing. -->
    <div class="episode-info-meta-line">
      {#if isCrewLoading}
        <Skeleton width="var(--ni-148)" height="var(--ni-14)" />
      {:else if mainCredit}
        <p class="small episode-main-credit" in:fade={fadeIn}>
          <MessageWithLink
            message={mainCredit.text}
            href={UrlBuilder.people(mainCredit.key, mainCredit.positions)}
            target="_self"
          />{#if mainCredit.others?.[0]}{creditSeparator}<Link
              href={UrlBuilder.people(
                mainCredit.others[0].key,
                mainCredit.positions,
              )}
              target="_self">{mainCredit.others[0].name}</Link
            >{/if}
        </p>
      {/if}
    </div>
  </div>

  <div class="episode-info-actions">
    {#if entry}
      <div class="episode-info-actions-content" in:fade={fadeIn}>
        <RenderFor audience="authenticated">
          <EpisodeActions
            episode={entry}
            {show}
            title={entry.title}
            showTitle={show.title}
          />
        </RenderFor>

        <div class="episode-info-secondary">
          <RenderFor audience="authenticated">
            <SocialActivitiesButton
              target={socialTarget}
              title={socialTitle}
              onclick={onSocialOpen}
            />
          </RenderFor>

          <RateNow type="episode" media={entry} {show} />
        </div>
      </div>
    {:else}
      <Skeleton
        height="var(--ni-56)"
        radius="var(--border-radius-xl)"
        width="var(--ni-280)"
      />
    {/if}
  </div>

  <div class="episode-info-overview">
    {#if entry}
      {#if entry.overview}
        <div in:fade={fadeIn}>
          <SpoilerSection media={entry} {show} type="episode">
            <ClampedText
              label={m.button_label_expand_media_overview({
                title: show.title,
              })}
              lineCount={2}
            >
              {entry.overview}
            </ClampedText>
          </SpoilerSection>
        </div>
      {/if}
    {:else}
      <div class="skeleton-overview">
        <Skeleton height="var(--ni-14)" />
        <Skeleton width="60%" height="var(--ni-14)" />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .episode-info-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    :global(.trakt-summary-poster-container) {
      --summary-poster-width: 100%;

      padding-top: var(--ni-16);
      width: 100%;
      align-items: center;
    }

    :global(.trakt-summary-ratings) {
      justify-content: center;
    }
  }

  .episode-info-poster-ratings {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);

    // The image fades in once decoded, so reserve the ratio on the wrapper
    // (the <img>'s aspect-ratio can't hold height while it's transparent) and
    // fill it with the skeleton colour. This keeps the poster from collapsing
    // to 0 and from showing an empty gap between the skeleton and the image.
    :global(.trakt-summary-poster) {
      width: 100%;
      aspect-ratio: 16 / 9;

      background-color: color-mix(
        in srgb,
        var(--color-border) 80%,
        transparent
      );
      border-radius: var(--border-radius-xxl);
    }

    // The poster container reserves --ni-16 of top padding (shadow room), so
    // the swipe container is taller than the image. Offset the indicator by
    // that padding so it lines up with the cover instead of overhanging it.
    :global(
      .episode-cover-swipe.trakt-gesture-container .trakt-gesture-indicator
    ) {
      inset-block: var(--ni-16) 0;
      height: auto;
    }
  }

  .skeleton-cover {
    width: 100%;

    // Mirror the poster container's top padding so the cover doesn't shift
    // when the real poster fades in.
    padding-top: var(--ni-16);
  }

  .skeleton-cover-inner {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  // Reserve the real ratings row height (icon + raised vote-count) so the
  // switcher below starts at the same vertical position in both states.
  .episode-info-ratings {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--ni-24);
  }

  .skeleton-ratings {
    display: flex;
    justify-content: center;
    gap: var(--gap-m);
  }

  .episode-info-switcher {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
    align-self: stretch;

    :global(.trakt-link) {
      display: inline-flex;
      align-items: center;
      color: var(--color-text-secondary);
    }
  }

  .episode-switcher-spacer {
    width: var(--ni-16);
  }

  .episode-info-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxs);
    text-align: center;
  }

  // Each line keeps a fixed height so swapping skeleton <-> text, or having no
  // credit at all, never shifts the layout below.
  .episode-info-meta-line {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--ni-16);
  }

  .episode-main-credit {
    :global(.trakt-link) {
      text-decoration-thickness: var(--ni-1);
    }
  }

  .episode-info-actions {
    align-self: stretch;

    display: flex;
    flex-direction: column;
    align-items: center;

    // Match the skeleton / actions-bar height so the area never collapses
    // below it while the entry loads or when there are no actions to show.
    min-height: var(--ni-56);
  }

  .episode-info-actions-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      :global(.trakt-summary-actions-bar) {
        width: var(--ni-280);
      }
    }
  }

  // Social activities pill + rate control, inline under the actions bar.
  .episode-info-secondary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);

    // The social pill defaults to a top margin / flex-start; neutralise it so
    // it sits centered inline with the rate control.
    :global(.trakt-social-activities-button-link-wrapper) {
      align-self: center;
      margin-top: 0;
    }

    :global(.trakt-rate-now) {
      gap: var(--gap-xxs);
    }
  }

  .episode-info-overview {
    align-self: stretch;

    margin-top: var(--gap-s);

    text-align: start;

    // Reserve exactly three lines (matching ClampedText's lineCount and 150%
    // line-height) so the skeleton and the loaded overview occupy the same
    // height and the tabs below never jump.
    min-height: calc(3 * var(--font-size-text) * 1.5);

    :global(.trakt-collapsable-content-button) {
      width: 100%;
      box-sizing: border-box;
    }

    // ClampedText is a flex container with align-items: flex-end that becomes a
    // column at this breakpoint, which right-aligns a short overview. Stretch
    // the paragraph so the text stays start-aligned like everywhere else.
    :global(.line-clamp-content) {
      align-self: stretch;
    }
  }

  .skeleton-overview {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
