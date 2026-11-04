<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useSeasonalTheme } from "$lib/features/theme/useSeasonalTheme";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import ArtworkPlaceholder from "$lib/components/skeleton/ArtworkPlaceholder.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import { fade } from "svelte/transition";
  import { useStagedArtReveal } from "./_internal/useStagedArtReveal.svelte.ts";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { onMount, untrack } from "svelte";
  import { of } from "rxjs";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import MastheadGradientBackdrop from "./_internal/MastheadGradientBackdrop.svelte";
  import SummaryHeaderStanding from "../../header-kit/SummaryHeaderStanding.svelte";
  import SummaryHeaderStatePill from "../../header-kit/SummaryHeaderStatePill.svelte";
  import SummaryHeaderSubline from "../../header-kit/SummaryHeaderSubline.svelte";
  import { toRecapStanding } from "../../header-kit/toRecapStanding.ts";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import { useSocialActivities } from "../../_internal/useSocialActivities";
  import { useTrivia } from "../../trivia/useTrivia";
  import { useMediaAwards } from "../../awards/useMediaAwards";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import RateNow from "../../rating/RateNow.svelte";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "../v2/_internal/MediaActions.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GlanceStrip from "./_internal/GlanceStrip.svelte";
  import SummaryHeaderByline from "./_internal/SummaryHeaderByline.svelte";
  import SummaryHeaderKicker from "./_internal/SummaryHeaderKicker.svelte";
  import SwipeCarousel from "$lib/components/carousel/SwipeCarousel.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import SummaryHeaderUpNext from "./_internal/SummaryHeaderUpNext.svelte";
  import { useShowProgress } from "$lib/stores/useShowProgress";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { IS_DEV } from "$lib/utils/env";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import MediaReactionsBadge from "$lib/features/media-reactions/MediaReactionsBadge.svelte";
  import RatingBadge from "../../rating/RatingBadge.svelte";
  import { mapToMainCredit } from "../../_internal/mapToMainCredit.ts";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";
  import SummaryHeaderSentiment from "./_internal/SummaryHeaderSentiment.svelte";
  import SummaryHeaderSocialActivity from "./_internal/SummaryHeaderSocialActivity.svelte";
  import SummaryHeaderTrivia from "./_internal/SummaryHeaderTrivia.svelte";
  import SummaryHeaderWatchOptions from "./_internal/SummaryHeaderWatchOptions.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import {
    HEADER_ACTIONS_PARAM,
    toHeaderActionsVariant,
  } from "./_internal/toHeaderActionsVariant.ts";
  import {
    HEADER_STRIP_PARAM,
    toHeaderStripVariant,
  } from "./_internal/toHeaderStripVariant.ts";
  import { page } from "$app/state";
  import SummaryHeaderTitle from "../../header-kit/SummaryHeaderTitle.svelte";
  import { mapToSummaryHeaderFacts } from "./_internal/mapToSummaryHeaderFacts.ts";
  import { mapToSummaryHeaderKicker } from "./_internal/mapToSummaryHeaderKicker.ts";
  import { toHeaderProviders } from "./_internal/toHeaderProviders.ts";
  import { toSummarySentiment } from "../../header-kit/toSummarySentiment.ts";
  import type { SummaryHeaderProps } from "./SummaryHeaderProps.ts";

  /*
    Direction 1b - "Masthead".

    Same information as 1a, given a magazine-cover treatment: a backdrop band
    that dissolves into the card, the poster mounted over it, and centred
    masthead type. Below the rule the composition stops centring - the credits,
    listings and sentiment strip is left-aligned, because it reads as a ruled
    data strip rather than more centred prose.
  */
  const { intl, crew, streamOn, sentiment, seasons, ...target }:
    SummaryHeaderProps = $props();

  const media = $derived(target.media);
  const title = $derived(intl?.title ?? media?.title ?? "");
  const overview = $derived(intl.overview ?? media.overview);

  const kicker = $derived(mapToSummaryHeaderKicker(target));
  const status = $derived(toTranslatedStatus(media.status));
  const facts = $derived(mapToSummaryHeaderFacts(target));

  /*
    Which strip renders. The SummaryGlanceStrip preview flag is the switch -
    on for the compact pill, off for the five-column spread - and `?strip=`
    overrides it for on-the-spot comparisons (including the labeled pill).
  */
  const { isEnabled } = useFeatureFlag();
  const isGlanceStripEnabled = isEnabled(FeatureFlag.SummaryGlanceStrip);
  const stripVariant = $derived.by(() => {
    const requested = page.url.searchParams.get(HEADER_STRIP_PARAM);
    if (requested != null) return toHeaderStripVariant(requested);
    return $isGlanceStripEnabled ? "glance" : "columns";
  });

  /*
    The strip carousel builds its pages in script, so the audience and flag
    guards the columns used to wear as components become plain conditions -
    the same checks RenderFor/RenderForFeature make internally.
  */
  const { isAuthorized } = useAuth();
  const { user } = useUser();
  const isDirector = $derived(
    $isAuthorized && (($user?.isDirector ?? false) || IS_DEV),
  );
  const isAwardsEnabled = isEnabled(FeatureFlag.SummaryAwards);

  /* `?actions=fused` seats the stars on the action tray's own surface. */
  const { activeTheme } = useSeasonalTheme();

  const actionsVariant = $derived(
    toHeaderActionsVariant(page.url.searchParams.get(HEADER_ACTIONS_PARAM)),
  );

  /* The pill leads with one provider; the columns show two. */
  const glanceProvider = $derived(
    toHeaderProviders(streamOn, 1).at(0)?.service ?? null,
  );
  const providers = $derived(toHeaderProviders(streamOn, 2));
  const headerSentiment = $derived(toSummarySentiment(sentiment));

  /*
    Trivia is surfaced here rather than only at the foot of the page. Two facts,
    matching the other columns' density; the chevron opens the full drawer.
    Spoiler-flagged facts are excluded - the header is not somewhere a reader
    opts in to them.
  */
  const { summary: triviaSummary, list: triviaList } = $derived(
    useTrivia({
      slug: media.slug,
      type: target.type,
      variant: "no-spoilers",
    }),
  );

  const { awards } = $derived(useMediaAwards({ slug: media.slug }));

  /*
    The kicker's gold item - same gate the awards column carried. Off the
    poster: pinned to the artwork it read as a sticker; in the kicker run it
    reads as one more fact about the title, which is what it is.
  */
  const hasKickerAwards = $derived(
    $isAwardsEnabled && isDirector && awards.length > 0,
  );
  const awardWins = $derived(
    awards.filter((award) => award.isWinner).length,
  );
  const kickerAwardsLabel = $derived.by(() => {
    if (awardWins > 0) {
      return awardWins === 1
        ? m.text_person_awards_count_one({ count: awardWins })
        : m.text_person_awards_count({ count: awardWins });
    }
    return awards.length === 1
      ? m.text_person_nominations_count_one({ count: awards.length })
      : m.text_person_nominations_count({ count: awards.length });
  });

  /* The columns' display limits - the pill shows totals instead. */
  const HEADER_TRIVIA_LIMIT = 2;
  const triviaFacts = $derived($triviaSummary.slice(0, HEADER_TRIVIA_LIMIT));

  /*
    The byline row under the title: who made it, when, how long - the credits
    column's essentials, folded into one line so the strip below frees a slot.
  */
  const mainCredit = $derived(mapToMainCredit(target.type, crew));
  const releaseParts = $derived(
    ["year", "length"]
      .map((key) => facts.find((fact) => fact.key === key))
      .map((fact) => fact?.inlineValue ?? fact?.value)
      .filter((part): part is string => Boolean(part)),
  );

  const { ratings, isLoading: isRatingsLoading } = $derived(
    useMediaMetaInfo(target),
  );

  const { watchCount } = $derived(useWatchCount(target));
  const { isDropped } = $derived(useIsDropped(media));
  const { isStarted } = $derived(useIsStarted(target));
  const { isRewatching } = $derived(useIsRewatching(target));
  const { isWatchlisted } = $derived(useIsWatchlisted(target));

  const { country } = useStreamingPreferences();

  /*
    Where the viewer stands with the show. Initialized once per mount - the
    movie and show routes mount separate pages, so the type cannot flip under
    a live component. Movies get no query at all.
  */
  const showProgress = untrack(() => target.type) === "show"
    ? useShowProgress(fromRune(() => media.slug))
    : null;
  const progress$ = showProgress?.progress ?? of(undefined);

  const socialTarget = $derived({ type: target.type, slug: media.slug });
  const socialTarget$ = fromRune(() => socialTarget);
  const { entries: socialEntries } = useSocialActivities(socialTarget$);

  const HEADER_SOCIAL_LIMIT = 3;
  const headerSocialEntries = $derived(
    $socialEntries.slice(0, HEADER_SOCIAL_LIMIT),
  );

  /* Three overlapped avatars; the count beside them carries the total. */
  const GLANCE_AVATAR_LIMIT = 3;
  const glanceSocial = $derived({
    users: $socialEntries
      .slice(0, GLANCE_AVATAR_LIMIT)
      .map((entryItem) => entryItem.user),
    count: $socialEntries.length,
  });

  /* "2025 · 9 episodes" - the release facts pre-joined for the strip. */
  const glanceRelease = $derived(
    releaseParts.length > 0 ? releaseParts.join(" · ") : null,
  );

  const postCreditsCount = $derived(media.postCredits?.length ?? 0);

  /*
    Tablet strip paging: three sections a page on the large tablet, two on
    the small one. Desktop fits the whole row; mobile stacks.
  */
  const isTabletSmallViewport = useMedia(WellKnownMediaQuery.tabletSmall);
  const tabletPageSize = $derived($isTabletSmallViewport ? 2 : 3);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsLink = $derived(buildDrawerLink(SummaryDrawers.Ratings));
  const glanceLink = $derived(buildDrawerLink(SummaryDrawers.Glance));
  const whereToWatchLink = $derived(
    buildDrawerLink(SummaryDrawers.WhereToWatch),
  );
  const sentimentLink = $derived(buildDrawerLink(SummaryDrawers.Sentiment));
  const socialLink = $derived(buildDrawerLink(SummaryDrawers.Social));
  const triviaLink = $derived(buildDrawerLink(SummaryDrawers.Trivia));
  const detailsLink = $derived(buildDrawerLink(SummaryDrawers.Details));
  /* Awards live in the details drawer now - the gold item opens it. */
  const kickerAwards = $derived(
    hasKickerAwards
      ? {
        label: kickerAwardsLabel,
        href: detailsLink.href,
        noscroll: detailsLink.noscroll,
        replacestate: detailsLink.replacestate,
        ariaLabel: m.button_label_view_awards({ title }),
      }
      : null,
  );
  const recapLink = $derived(buildDrawerLink(SummaryDrawers.SeasonRecap));

  const justWatchRank = $derived(
    streamOn?.services?.streamingRank?.current ?? null,
  );

  /*
    The sublines - one 22px line under every column header, so the five columns
    share a rhythm. Pills mark state (the standing, the verdict); text marks
    counts (friends and plays, facts, the JustWatch rank), so the row keeps
    exactly two colour anchors.
  */
  const recapStanding = $derived(
    $progress$ ? toRecapStanding($progress$) : null,
  );

  const socialFriends = $derived(
    $socialEntries.length === 1
      ? m.text_friends_count_one({ count: 1 })
      : m.text_friends_count({ count: $socialEntries.length }),
  );
  const socialPlays = $derived.by(() => {
    const plays = $socialEntries.reduce(
      (sum, entry) => sum + (entry.watched?.plays ?? 0),
      0,
    );
    if (plays === 0) return null;
    return plays === 1
      ? m.tag_text_play({ number: plays })
      : m.text_play_count({ count: plays });
  });

  const triviaFactsCount = $derived(
    $triviaList.length === 1
      ? m.text_trivia_facts_count_one({ count: 1 })
      : m.text_trivia_facts_count({ count: $triviaList.length }),
  );

  /*
    One curtain over the poster and the band, lifted in order. See
    useStagedArtReveal for why they wait for each other rather than racing.
  */
  /*
    The staggered arrival (design 48a). One state change drives the whole
    cascade - `style/animations/index.css` owns the waves, their spacing and
    how far each one travels; this only says when to start.

    Fired on mount rather than off the art staging below: an image that never
    loads must not be able to leave the header invisible. The two run
    independently - this brings the text and the chrome in, that one settles
    the poster and the artwork in their own order.
  */
  let revealStage = $state<"loading" | "revealed">("loading");

  onMount(() => {
    const frame = requestAnimationFrame(() => (revealStage = "revealed"));
    return () => cancelAnimationFrame(frame);
  });

  const reveal = useStagedArtReveal({
    sources: () => [media.poster.url.medium, media.cover.url.medium],
    // Main's navbar keeps its row in place, so there is nothing to wait out.
    isHeld: () => false,
  });
</script>

{#snippet tags()}
  <SummaryPosterTags
    {postCreditsCount}
    watchCount={$watchCount}
    isDropped={$isDropped}
    isStarted={$isStarted}
    isRewatching={$isRewatching}
    isWatchlisted={$isWatchlisted}
  />
{/snippet}

{#snippet artwork()}
  <!--
    Held until the poster has been up for a beat. The band is the larger
    surface, so letting it land first makes the poster look late to its own
    header - the order is what sells it, not the fade.
  -->
  {#if reveal.isArtRevealed}
    <div class="masthead-artwork" in:fade={{ duration: 520 }}>
      <CrossOriginImage src={media.cover.url.medium} alt="" />
    </div>
  {/if}
{/snippet}

<article class="trakt-masthead-summary-header" data-reveal={revealStage}>
  <div class="masthead-backdrop" data-reveal-wave="1">
    <!--
      The PosterGradientBackdrop preview trades the artwork for a gradient in
      the poster's own colours. Titles the API has no colours for keep the
      artwork, so the band is never empty.
    -->
    <RenderForFeature flag={FeatureFlag.PosterGradientBackdrop} audience="director">
      {#snippet enabled()}
        {#if media.colors}
          <MastheadGradientBackdrop colors={media.colors} />
        {:else}
          {@render artwork()}
        {/if}
      {/snippet}
      {@render artwork()}
    </RenderForFeature>
    <!--
      Stands in the band's place until the artwork is allowed in, painted from
      the title's own colours - so the image resolves into something already
      of the right hue instead of replacing a grey slab. Dissolves on the same
      curve as the artwork, or it would end on the hard edge that curve exists
      to avoid.
    -->
    {#if !reveal.isArtRevealed}
      <div
        class="masthead-backdrop-placeholder"
        out:fade={{ duration: 400 }}
        aria-hidden="true"
      >
        <ArtworkPlaceholder colors={media.colors} />
      </div>
    {/if}

    <!--
      The overlay resolves to the card background so the band dissolves into the
      content rather than ending on a hard edge.
    -->
    <div class="backdrop-veil" aria-hidden="true"></div>
  </div>

  <div class="masthead-content">
    <div class="masthead-poster" data-reveal-wave="1">
      <SummaryPoster
        src={media.poster.url.medium}
        alt={title}
        colors={media.colors}
        isRevealed={reveal.isPosterRevealed}
        {tags}
      />
    </div>

    <div class="masthead-kicker" data-reveal-wave="3">
      <SummaryHeaderKicker
        {kicker}
        {status}
        awards={kickerAwards}
        variant="inline"
      />
    </div>

    <!--
      The title is the biggest touch target on the page, so it earns the most
      wanted destination: the details drawer, where the full description now
      lives. Same target as the credits chevron and the glance release token.
    -->
    <div class="masthead-title-link" data-reveal-wave="2">
      <Link
        href={detailsLink.href}
        color="inherit"
        label={m.button_label_details({ title })}
      >
        <SummaryHeaderTitle {title} />
      </Link>
    </div>

    <!--
      The credits column's essentials, promoted to the masthead proper: the
      main credit, the year, the length, dot-separated on one line. The info
      mark at the row's end opens the details drawer, where everything the
      old column said (and more) still lives.
    -->
    {#if mainCredit || releaseParts.length > 0}
      <div class="masthead-byline" data-reveal-wave="3">
        {#if mainCredit}
          <SummaryHeaderByline type={target.type} {crew} />
        {/if}

        {#each releaseParts as part, index (part)}
          {#if index > 0 || mainCredit}
            <span class="byline-dot" aria-hidden="true">•</span>
          {/if}
          <span class="byline-fact">{part}</span>
        {/each}

        <div class="byline-details">
          <ActionButton
            href={detailsLink.href}
            noscroll={detailsLink.noscroll}
            replacestate={detailsLink.replacestate}
            label={m.button_label_details({ title })}
            style="ghost"
            size="small"
          >
            <InfoIcon />
          </ActionButton>
        </div>
      </div>
    {/if}

    <!--
      The scores follow the credits: the kicker stays on the title it labels,
      so the read is kicker, title, credits, scores, overview. Logos over
      dot-and-label, matching the anchored direction.
    -->
    <div class="masthead-scores" data-reveal-wave="3">
      <RatingList
        ratings={$ratings}
        entry={media}
        drilldown={ratingsLink}
        isLoading={$isRatingsLoading}
      />
    </div>
    <!--
      Two lines, then an ellipsis - the full text is one tap away in the
      details drawer (title, chevron or glance token). The old inline "+ more"
      expanded the card downward and pushed the actions off the fold.
    -->
    <div class="masthead-deck" data-reveal-wave="3">
      <Spoiler {media} type={target.type}>
        <!-- The clamp promises more; clicking the text delivers it. -->
        <Link
          href={detailsLink.href}
          color="inherit"
          label={m.button_label_details({ title })}
        >
          <p class="deck-text">{overview}</p>
        </Link>
      </Spoiler>
    </div>

    <!--
      Actions sit directly under the deck, above the scores: they are the reason
      most people are on this page, and below the scores and the strip they fell
      under the fold.
    -->
    <RenderFor audience="authenticated">
      <!--
        One row rather than the live page's stack: the bar with a mark either
        side of it. Stacking put the rate row on its own line, which only
        appeared for rateable titles and shifted everything under it when it
        did; side by side, an absent mark costs the row nothing.
      -->
      <div
        class="masthead-actions"
        data-reveal-wave="4"
        data-seasonal={$activeTheme !== null}
      >
        {#if actionsVariant === "fused"}
          <!--
            One tray: the stars share the action bar's dark surface, a hairline
            bar between them. The bar inside is still the stock component - only
            its shadow is suppressed, since a shadow inside a same-colour tray
            reads as a smudge.
          -->
          <div class="fused-tray">
            <RateNow type={target.type} {media} />
            <span class="fused-divider" aria-hidden="true"></span>
            <MediaActions {media} {title} />
          </div>
        {:else}
          <!--
            One row: how you felt on the left, what you can do in the middle,
            what you scored it on the right. The bar keeps the middle because
            it is the row's business; the two marks flank it because each is a
            single answer about this title, not an action on it.
          -->
          <div class="action-row">
            <MediaReactionsBadge
              type={target.type}
              slug={media.slug}
              id={media.id}
            />
            <span class="action-row-divider" aria-hidden="true"></span>

            <MediaActions {media} {title} />

            <span class="action-row-divider" aria-hidden="true"></span>

            <!--
              Score then heart. The score stays clean, a grey pill only on
              hover; any title can be rated, so it stays open before
              watching, just quieter. The
              heart leaves the rating bubble: favouriting is its own answer,
              and burying it in a popover meant opening the stars to reach it.
            -->
            <RatingBadge
              target={{ type: target.type, media }}
              favorite
              look="chip"
            />
          </div>
        {/if}
      </div>
    </RenderFor>


    {#if stripVariant === "columns"}
    {#snippet watchColumn()}
      <div class="strip-column strip-column-borrowed">
        <div class="column-head">
          <SummaryHeaderSectionHeader
            title={m.list_title_where_to_watch()}
            drilldown={{
              ...whereToWatchLink,
              label: m.button_label_view_all_where_to_watch(),
            }}
          />
          {#if justWatchRank}
            <SummaryHeaderSubline>
              <span class="watch-rank">
                <MessageWithBold
                  message={m.text_just_watch_chart_rank({ rank: justWatchRank })}
                />
              </span>
            </SummaryHeaderSubline>
          {:else}
            <SummaryHeaderSubline lead={m.text_just_watch()} />
          {/if}
        </div>
        <SummaryHeaderWatchOptions {providers} country={$country} />
      </div>
    {/snippet}

    <!--
      The viewer's own standing. Not marked borrowed: no other section on the
      page says where YOU are. The chevron opens the recap drawer.
    -->
    {#snippet recapColumn()}
      {#if $progress$}
        <div class="strip-column">
          <div class="column-head">
            <SummaryHeaderSectionHeader
              title={m.header_recap()}
              drilldown={{
                ...recapLink,
                label: m.button_label_view_recap({ title }),
              }}
            />
            {#if recapStanding}
              <SummaryHeaderSubline>
                <SummaryHeaderStanding standing={recapStanding} />
              </SummaryHeaderSubline>
            {/if}
          </div>
          <SummaryHeaderUpNext progress={$progress$} show={media} />
        </div>
      {/if}
    {/snippet}

    {#snippet socialColumn()}
      <div class="strip-column strip-column-borrowed">
        <div class="column-head">
          <SummaryHeaderSectionHeader
            title={m.list_title_social_activity()}
            drilldown={{
              ...socialLink,
              label: m.button_label_view_all_social_activity(),
            }}
          />
          <SummaryHeaderSubline lead={socialFriends} rest={socialPlays} />
        </div>
        <SummaryHeaderSocialActivity entries={headerSocialEntries} />
      </div>
    {/snippet}

    {#snippet sentimentColumn()}
      {#if headerSentiment}
        <div class="strip-column strip-column-borrowed">
          <div class="column-head">
            <SummaryHeaderSectionHeader
              title={m.header_insights()}
              drilldown={{
                ...sentimentLink,
                label: m.button_label_view_sentiment_analysis(),
              }}
            />
            <SummaryHeaderSubline>
              <SummaryHeaderStatePill
                label={headerSentiment.label}
                tone={headerSentiment.verdict}
              />
            </SummaryHeaderSubline>
          </div>
          <SummaryHeaderSentiment sentiment={headerSentiment} showVerdict={false} />
        </div>
      {/if}
    {/snippet}

    {#snippet triviaColumn()}
      <div class="strip-column strip-column-borrowed strip-column-stretch">
        <div class="column-head">
          <SummaryHeaderSectionHeader
            title={m.list_title_trivia()}
            drilldown={{
              ...triviaLink,
              label: m.button_label_view_trivia(),
            }}
          />
          <SummaryHeaderSubline lead={triviaFactsCount} />
        </div>
        <SummaryHeaderTrivia facts={triviaFacts} />
      </div>
    {/snippet}

    {@const hasRecap = Boolean(
      $isAuthorized && $progress$ && $progress$.total > 0,
    )}
    <!--
      Five sections at most - progress, social, watch, sentiment, trivia -
      which is exactly one row now that credits moved under the title and
      awards onto the poster. No more paging: the strip IS the page.
      Progress opens the row: the viewer's own standing is the one thing
      here that asks them to do something, so it reads first. Trivia closes
      it: the one column that stretches (its prose runs long) reads wrong
      anywhere but the edge, so where to watch takes the middle.
    -->
    {@const stripColumns = [
      ...(hasRecap ? [{ key: "recap", column: recapColumn }] : []),
      ...($isAuthorized && headerSocialEntries.length > 0
        ? [{ key: "social", column: socialColumn }]
        : []),
      { key: "watch", column: watchColumn },
      ...(headerSentiment
        ? [{ key: "sentiment", column: sentimentColumn }]
        : []),
      ...(triviaFacts.length > 0
        ? [{ key: "trivia", column: triviaColumn }]
        : []),
    ]}

    {@const tabletPages = Array.from(
      { length: Math.ceil(stripColumns.length / tabletPageSize) },
      (_, index) =>
        stripColumns.slice(
          index * tabletPageSize,
          (index + 1) * tabletPageSize,
        ),
    )}

    {#snippet tabletPageContent(entries: typeof stripColumns)}
      <div class="strip-page" style="--strip-page-columns: {tabletPageSize}">
        {#each entries as entry (entry.key)}
          {@render entry.column()}
        {/each}
      </div>
    {/snippet}

    <!--
      Three no-arg wrappers because SwipeCarousel takes argument-less
      snippets: at two sections a page, five sections need three pages.
    -->
    {#snippet tabletPageA()}{@render tabletPageContent(tabletPages[0] ?? [])}{/snippet}
    {#snippet tabletPageB()}{@render tabletPageContent(tabletPages[1] ?? [])}{/snippet}
    {#snippet tabletPageC()}{@render tabletPageContent(tabletPages[2] ?? [])}{/snippet}

    <div class="masthead-strip">
      <RenderFor audience="all" device={["desktop"]}>
        <div class="strip-page">
          {#each stripColumns as entry (entry.key)}
            {@render entry.column()}
          {/each}
        </div>
      </RenderFor>

      <!--
        The tablet widths page through the profile header's carousel instead
        of scattering into a stack: press the arrow, see the rest. Keyed by
        page geometry - the carousel counts its slides once at mount.
      -->
      <RenderFor audience="all" device={["tablet-sm", "tablet-lg"]}>
        {#key `${tabletPages.length}-${tabletPageSize}`}
          <SwipeCarousel
            items={[tabletPageA, tabletPageB, tabletPageC].slice(
              0,
              tabletPages.length,
            )}
          >
            {#snippet item(page)}
              {@render page()}
            {/snippet}
          </SwipeCarousel>
        {/key}
      </RenderFor>

      <RenderFor audience="all" device={["mobile"]}>
        <div class="strip-stack">
          {#each stripColumns as entry (entry.key)}
            {@render entry.column()}
          {/each}
        </div>
      </RenderFor>
    </div>
    {:else}
    <!--
      The strip, folded to one line. Everything the five columns said is still
      referenced - release, listings, follows, sentiment, awards, reactions,
      trivia - but as tokens, because a full column of each right at the top of
      the page outweighed the page. The pill opens the at-a-glance drawer, where
      the sections appear at their old density and drill into their full views.
    -->
    <div class="masthead-glance" data-reveal-wave="5">
      <GlanceStrip
        links={{
          details: detailsLink.href,
          whereToWatch: whereToWatchLink.href,
          social: socialLink.href,
          sentiment: sentimentLink.href,
          awards: detailsLink.href,
          trivia: triviaLink.href,
        }}
        {title}
        labeled={stripVariant === "labeled"}
        release={glanceRelease}
        provider={glanceProvider}
        country={$country}
        social={glanceSocial}
        sentiment={headerSentiment}
        awardsCount={awards.length}
        triviaCount={$triviaList.length}
      />
    </div>
    {/if}

  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "../../header-kit/backdropDissolve" as dissolve;

  .trakt-masthead-summary-header {
    position: relative;

    /*
      The masthead's geometry, derived rather than hardcoded.

      The poster's height and the band's overlap must stay equal - that is what
      lands the poster's base exactly on the band's bottom edge, so the artwork
      finishes dissolving there instead of stopping mid-poster. Deriving both from
      the poster width keeps that true when the poster is resized; the previous
      hardcoded 264px silently broke the moment the poster changed size.

      Knobs:
      - `--masthead-poster-width`  how big the poster is (2:3, so height is 1.5x).
      - `--masthead-rhythm`  the ONE vertical spacing value in this header. It is
        the gap above the card and the space between every block in the centred
        stack (poster, kicker, title, deck). Driving both from one place is the
        point: as separate values they read as unrelated gaps, and any of them
        drifting breaks the even frame Sefer is after.
      - `--masthead-poster-overhang`  how far the poster stands ABOVE the band.
        The band used to be taller than the poster, showing a strip of artwork
        over it; it is now shorter by this much, so the poster breaks the top
        edge and the artwork reads as something it is standing in front of
        rather than a panel it sits inside. The card's top margin carries the
        same value, so the poster keeps its distance from the navbar.
        Everything in the centred stack rides with the poster.
      - `--backdrop-focus`  which slice of the 16:9 backdrop is framed.
      - `--backdrop-fade-start` / `--backdrop-fade-end`  where the artwork begins
        and finishes dissolving. Push `end` higher to keep more artwork, but leave
        headroom before 100% - that gap is what guarantees no visible cut.
      - `--backdrop-fade-spread` / `--backdrop-fade-depth`  the shape of the
        dissolve. Narrowing `spread` deepens the V; widening it flattens it back
        towards a straight line. Keep `spread` at or above 100% or the top corners
        start fading too (see the note on the mask).
    */
    /*
      Fluid, and the derived geometry below follows for free - which is the whole
      reason the band and overlap are computed from this rather than hardcoded. A
      fixed 220px poster on a phone left the backdrop band taller than the screen.
    */
    /*
      The dock's exit paid for this: the poster steps PAST its old 220 ceiling
      to 240 - the hero the composition deserves - and the height term keeps
      it honest on short screens (26vh at 1080 clears the new cap, so a
      1920x1080 viewer gets the full 240x360).
    */
    --masthead-poster-width: clamp(
      var(--ni-132),
      min(19vw, 26vh),
      var(--ni-240)
    );
    --masthead-poster-height: calc(var(--masthead-poster-width) * 1.5);
    /*
      gap-m, not gap-l: the fold audit. At 1920x1080 the header runs on this
      one token six times over, and 24px beats read as looseness rather than
      air. 16px keeps every block distinct while pulling ~48px of intel back
      above the fold. Pure spacing - no font, line-height (WCAG 1.4.12) or
      target size (WCAG 2.5.8: controls stay 40-48px) gives anything up.
    */
    --masthead-rhythm: var(--gap-m);
    --masthead-poster-overhang: var(--ni-32);

    --backdrop-overlap: calc(-1 * var(--masthead-poster-height));
    /*
      SHORTER than the poster, which is what makes the poster break the band's
      top edge instead of sitting inside it. The overlap below still lands the
      poster's base on the band's bottom, so the difference between the two
      heights is exactly how far the poster stands proud.
    */
    --backdrop-height: calc(
      var(--masthead-poster-height) - var(--masthead-poster-overhang)
    );


    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    /*
      The top gap carries the overhang as well as the rhythm: the poster now
      stands above the card, and without the extra the amount it stands by is
      taken straight out of the space under the navbar.
    */
    margin: calc(var(--masthead-rhythm) + var(--masthead-poster-overhang))
      var(--layout-distance-side) var(--masthead-rhythm);

    border-radius: var(--border-radius-xl);
    background: var(--color-background);

    /*
      Deliberately NOT `overflow: hidden`. The action bar's popup menu opens
      downward out of this card, and clipping here crops it behind the card edge.
      The backdrop band clips itself to the top corners instead, so the artwork
      still respects the radius while the popup can escape.
    */
  }

  /*
    The card's stroke, as a masked 1px ring rather than a `border` - a border
    cannot carry a gradient, and `border-image` would drop the corner radius.

    The ring holds the backdrop band at the top, then fades out downward so the
    card has dissolved into the page by the time the next section starts. Tune
    where it vanishes with --header-stroke-fade.
  */
  .trakt-masthead-summary-header::before {
    @include dissolve.masthead-stroke;
  }

  .masthead-backdrop {
    position: relative;
    /* Poster height plus the reveal above it - see the geometry block above. */
    height: var(--backdrop-height);

    overflow: hidden;
    border-start-start-radius: var(--border-radius-xl);
    border-start-end-radius: var(--border-radius-xl);

    :global(img) {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      /*
        Which slice of a 16:9 backdrop shows in a band this short. Slightly above
        centre is where subjects usually sit; `top` gave us the empty sky above
        them, which is what made some titles look like a flat colour field.
      */
      object-position: center var(--backdrop-focus, 30%);

      /*
        The fanart sits back behind the composition rather than competing with
        it: the poster, the title and the marks are the subject, and a sharp
        still behind them reads as a second one.

        Scaled with the blur because a blur samples past the image's own
        edges - unscaled, the band frays along the top and sides. The band
        clips, so the extra never shows.
      */
      filter: blur(var(--ni-10));
      transform: scale(1.06);

      /*
        The image fades its OWN alpha out, rather than being hidden under an opaque
        gradient, and it does so along a curve rather than a straight line.

        Two separate problems being solved here:

        1. An overlay has to reach exactly --color-background before the image's
           bottom edge or the cut shows - and how much coverage that takes depends
           on how bright the artwork is, so it held up on dark backdrops and fell
           apart on light ones. A mask has no colour to match: pixels go
           transparent and the card shows through, whatever the artwork.

        2. A `to bottom` linear fade dissolves along a perfectly horizontal line.
           However soft it is, a straight edge spanning the full width still reads
           as a seam. A radial gradient anchored at top-centre fades later in the
           middle than at the sides - a broad rounded V that dips behind the poster
           - so there is no straight boundary for the eye to catch.

        The ellipse is as wide as the band and slightly deeper, which keeps the top
        corners inside the opaque stop (their normalised distance is 0.5, under
        `fade-start`) while the bottom edge sits past `fade-end` everywhere. That
        is what guarantees full artwork at the top and no reachable cut at the
        bottom.
      */
      @include dissolve.backdrop-dissolve;
    }
  }

  /* Both fill the band; the artwork comes second in the DOM, so it arrives
     over the placeholder rather than beside it. */
  .masthead-artwork,
  .masthead-backdrop-placeholder {
    position: absolute;
    inset: 0;
  }

  .masthead-backdrop-placeholder {
    @include dissolve.backdrop-dissolve;
  }

  .backdrop-veil {
    position: absolute;
    inset: 0;

    @include dissolve.backdrop-veil;
  }

  .masthead-content {
    position: relative;
    /*
      Above the card's stroke, which rides at --layer-raised. The poster now
      stands proud of the band, and a ring drawn over it put a hairline
      straight across the artwork - the poster has to be in front of both the
      fanart and the edge that frames it.
    */
    z-index: var(--layer-floating);

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    /* The same rhythm as the frame insets, so every gap in the card matches. */
    gap: var(--masthead-rhythm);

    /*
      The CARD stays fluid; the CONTENT does not follow it forever. On big
      screens everything inside caps at 1280 and centres, so lines, strips and
      rows keep a readable measure however wide the window - and the gap this
      opens beside the content is where differently sized cards go next.
    */
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    box-sizing: border-box;

    /*
      The side padding sets the centred measure, so it has to scale rather than sit
      at the 120px it was drawn with - at 1024px that alone ate a quarter of the
      window and squeezed the strip below into unreadable columns.
    */
    padding: 0 clamp(var(--gap-m), 8vw, var(--ni-120)) var(--ni-28);
    /*
      Matches the poster height, so the poster's base lands exactly where the
      band ends and the dissolve completes. Change this and the band height
      together.
    */
    margin-top: var(--backdrop-overlap);

    /*
      One step larger than the anchored direction, on a tighter measure. Fluid for
      the same reason the anchored title is - the length bucket picks WHICH size,
      the viewport decides how big it renders.
    */
    --title-size-large: clamp(var(--ni-32), 5.2vw, var(--ni-66));
    --title-size-medium: clamp(var(--ni-28), 4.4vw, var(--ni-56));
    --title-size-small: clamp(var(--ni-24), 3.8vw, var(--ni-48));
    --title-measure: 20ch;

    /*
      The `gap` above already spaces every block equally - poster, kicker, title,
      deck - but they did not LOOK equal, and that is a type problem rather than a
      spacing one.

      A line box is taller than the glyphs inside it. At 66px the title carries
      roughly 16px of empty space above its capitals and 13px below its baseline,
      all inside its own box, so its neighbours read as further away than the 10px
      kicker's do. Trimming the text box to the cap and alphabetic edges makes the
      box hug the glyphs, so the single `gap` value becomes the space you actually
      see - no per-element compensation to keep in sync.

      Progressive: browsers without text-box-trim keep today's leading-based
      spacing, which is merely uneven rather than broken.
    */
    @supports (text-box-trim: trim-both) {
      :global(.trakt-summary-header-title),
      .masthead-deck {
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
      }
    }

    @include for-tablet-sm-and-below {
      padding-bottom: var(--ni-28);
    }
  }

  .masthead-poster {
    --summary-poster-width: var(--masthead-poster-width);
    --summary-poster-radius: var(--border-radius-m);

    position: relative;

    /*
      The cast shadow, on top of the tight one SummaryPoster already carries.
      Two shadows because the poster is not lying on the artwork - its base
      rests on the band while its top stands --masthead-poster-overhang clear
      of it, so the light under it is not even: the shared shadow does the
      contact at the foot, and this does the throw.

      It reaches furthest past the poster at the TOP, which is the end held
      highest off the surface, and tightens to nothing at the bottom where the
      two meet. The gradient thins as it falls for the same reason - a cast
      shadow weakens with the distance it travels.

      A box-shadow could not do this: one is the same weight the whole way
      round, and stacking several cannot make the spread grow along an edge.
    */
    &::before {
      content: "";

      position: absolute;
      inset: calc(-1.4 * var(--masthead-poster-overhang)) var(--ni-10)
        var(--ni-4);
      z-index: -1;

      border-radius: var(--border-radius-xl);
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-shadow) 60%, transparent) 0%,
        color-mix(in srgb, var(--color-shadow) 34%, transparent) 45%,
        color-mix(in srgb, var(--color-shadow) 12%, transparent) 78%,
        transparent 100%
      );
      filter: blur(var(--ni-16));

      pointer-events: none;
    }
  }

  /*
    Hovering anywhere over the scores draws one selection around the whole
    row - the reactions pill's manner. Padding and negative margin trade so
    the surface appears without the row moving. Items keep their own links;
    the chevron keeps the drawer.
  */
  .masthead-scores {
    padding: var(--ni-8) var(--ni-12);
    /*
      The inline negatives trade against the padding so the row keeps its
      place; the top margin keeps it snug to the kicker line above.

      No wash here: the drilldown button inside carries its own hover, and a
      surface around it meant one hover lit two boxes. The button's box is
      also the click target, so the highlight and the way in are one thing.
    */
    margin: calc(var(--gap-xs) - var(--masthead-rhythm) - var(--ni-8))
      calc(-1 * var(--ni-12))
      calc(-1 * var(--ni-8));
  }

  .masthead-title-link {
    :global(a) {
      text-decoration: none;
      color: inherit;
    }
  }

  .masthead-byline {
    /*
      Positive air on top of the column's beat, not a pull-up. The title is
      trimmed to its baseline (text-box-trim), so its descenders hang BELOW
      its box - a "Trying" or "Fargo" reaches ~0.2em into whatever follows,
      and the old negative margin put the byline right where they land.
    */
    margin-top: var(--gap-xs);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-xs);

    color: var(--color-text-quiet);
    font-size: var(--ni-16);

    .byline-dot {
      color: var(--color-text-quiet);
      opacity: 0.6;
    }

    .byline-fact {
      white-space: nowrap;
    }

    /*
      The small ActionButton pads itself out to its 40px target; pulling the
      visual back in keeps the mark on the row's text rhythm without giving
      up the target size.
    */
    .byline-details {
      display: inline-flex;
      align-items: center;

      :global(svg) {
        /*
          The small ActionButton scales its whole self by 0.8, so the icon
          overshoots: 28 inside renders ~22 on screen. (26 was tried first -
          the token does not exist and the rule silently kept the old size.)
        */
        width: var(--ni-28);
        height: var(--ni-28);
      }
    }
  }

  .masthead-deck :global(a) {
    text-decoration: none;
    color: inherit;
  }

  .deck-text {
    margin: 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .masthead-deck {
    max-width: 58ch;

    /* Larger than 1a's synopsis - it carries the centred composition. */
    font-size: var(--ni-20);
    line-height: 1.55;
    color: var(--color-text-soft);
    text-wrap: pretty;
  }

  /*
    Only there to give the kicker a box for the cascade to animate - it has no
    look of its own. It cannot be `display: contents`: an element with no box
    cannot take a transform, so the wave would skip it.
  */
  .masthead-kicker {
    display: flex;
    justify-content: center;
  }

  .masthead-glance {
    width: 100%;

    /*
      No pull-up: the score row sits centred between the action tray above and
      this pill below when both gaps keep the column's full rhythm. The old
      snug margin made the lower gap visibly shorter than the upper one.
    */

    display: flex;
    justify-content: center;
  }

  .masthead-strip {
    width: 100%;
    padding-top: var(--ni-20);

    border-top: var(--ni-1) solid var(--color-hairline);

    /* The composition centres; the data does not. */
    text-align: start;
  }

  /*
    The one row: every section is a fixed fifth-width column, and the row
    CENTRES whatever it holds. Anonymous movie pages run three columns, a
    signed-in show all five; the centring keeps every mix balanced instead
    of hugging the start with a dead zone.
  */
  .strip-page {
    display: flex;
    justify-content: center;
    gap: var(--ni-32);

    /*
      Weighted, not fixed: columns share the row by growth weight, so the
      section mix can vary - and it will, a lot - without any one combination
      going lopsided. Ordinary columns cap near a fifth; trivia carries 1.4x
      the weight and caps at a quarter, because its prose goes tall and
      upright in a fifth and that unbalances the whole band.
    */
    /* Desktop fits the row of five; tablet pages set their own count. */
    --strip-page-columns: 5;

    > .strip-column {
      flex: 1 1 0;
      min-width: 0;
      max-width: calc(
        (100% - (var(--strip-page-columns) - 1) * var(--ni-32)) /
          var(--strip-page-columns)
      );
    }

    > .strip-column-stretch {
      flex-grow: 1.4;
      max-width: calc(
        (100% - (var(--strip-page-columns) - 2) * var(--ni-32)) /
          (var(--strip-page-columns) - 1)
      );

      /*
        Alone in its row, the quarter-cap left one tight column adrift in an
        empty viewport, three words a line. With the row to itself it takes
        a real prose measure instead - still centred, finally readable.
      */
      &:only-child {
        max-width: min(72ch, 100%);
      }
    }
  }

  /*
    Below desktop the columns stack as they always have - auto-fit with a
    width floor, one column on the narrowest screens.
  */
  .strip-stack {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--strip-column-min, var(--ni-200)), 1fr)
    );
    gap: var(--ni-32);

    @include for-tablet-sm-and-below {
      gap: var(--gap-l);
      --strip-column-min: 100%;
    }
  }

  /*
    Every strip column except credits also exists as a section further down the
    page, and those sections render at tablet-lg and below. Showing both is how a
    narrow window ended up with where-to-watch, sentiment and trivia twice.

    Rather than redesign those sections to work inside the strip at every width,
    the header yields: below desktop it keeps only credits - the one thing with no
    equivalent elsewhere - and the page's own sections do the rest. The two gates
    are exact complements, so nothing is shown twice and nothing goes missing.
  */

  /*
    One grid across the five: title row, the 22px meta line, then items on
    44px rows 12px apart - so titles, meta lines, avatars, logo tiles and
    first bullets land on the same horizontal lines in every column.
  */
  .strip-column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-16);

    min-width: 0;

    --summary-header-row-height: var(--ni-44);
    --summary-header-row-gap: var(--ni-12);
    --summary-header-tile: var(--ni-44);
    --sentiment-bullet-gap: var(--summary-header-row-gap);
  }

  /* "#12 on JustWatch": the rank leads in white, the rest stays quiet. */
  .watch-rank {
    font-size: var(--font-size-text-small);
    color: var(--color-text-quiet);
    white-space: nowrap;

    :global(b) {
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  /*
    Header and subline are one block, set tighter than the column's rhythm:
    the subline qualifies its header, so the two read as a unit and the body
    hangs off them at the full 14px.
  */
  .column-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 4px, by eye: 8 still read as a gap rather than a line break. */
    gap: var(--ni-4);

    min-width: 0;
    max-width: 100%;
  }

  .masthead-actions {
    /*
      Stacked and centred, with no rule above it.

      A row with `space-between` was right when this closed the card; sitting
      mid-composition, edge-spread clusters and a horizontal rule both cut across
      the centred masthead. Stacking also keeps the action bar on the centre line
      regardless of whether the rate row above it is present.
    */
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: var(--gap-xxs);

    /* The seasonal mascot's room, taken above the tray rather than by the bar
       inside it - see the action row below. */
    &[data-seasonal="true"] {
      margin-top: calc(var(--gap-xxs) + var(--ni-10));
    }

    .fused-tray {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      /* The stock bar's own surface, stretched around both halves. */
      background-color: var(--color-actions-bar-background);
      /* Fully round, like every pill, tag and toggle: the pill token stops
         at 24px, which leaves a 56px tray with flat ends. */
      border-radius: 999px;
      padding-inline-start: var(--ni-20);

      /* Inside a same-colour tray the bar's lift reads as a smudge. */
      --summary-actions-bar-shadow: none;
      --summary-actions-bar-seasonal-headroom: 0;
    }

    .fused-divider {
      width: var(--ni-1);
      height: var(--ni-24);
      background: var(--color-hairline);

      /* An unrateable title renders no stars - no stars, no divider. */
      &:first-child {
        display: none;
      }
    }

    .action-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--gap-m);

      max-width: 100%;

      /*
        One tray across all three: the bar's own surface, stretched around the
        marks either side. They read as part of the same instrument rather
        than as two loose glyphs floating beside a box - the bar inside keeps
        its identical colour, so the seam does not show, and drops its lift,
        which inside a same-colour tray reads as a smudge.
      */
      padding-inline: var(--ni-16);
      box-sizing: border-box;

      /*
        Lifted off the backdrop: a faint wash with a lit top edge and a
        hairline, over a blur of whatever sits behind, so the tray holds
        together on any artwork without shouting. The bar inside drops its
        own surface into it.
      */
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 3.5%,
        transparent
      );
      border-radius: 999px;
      box-shadow:
        inset 0 var(--ni-1) 0
          color-mix(in srgb, var(--color-foreground) 10%, transparent),
        inset 0 0 0 var(--ni-1)
          color-mix(in srgb, var(--color-foreground) 10%, transparent),
        0 var(--ni-12) var(--ni-32)
          color-mix(in srgb, var(--color-shadow) 35%, transparent);
      backdrop-filter: blur(var(--ni-20));

      --summary-actions-bar-shadow: none;
      --summary-actions-bar-background: transparent;
      --rating-badge-dot-ring: transparent;
      /* The bar shares the row's centre line with the marks beside it. */
      --summary-actions-bar-seasonal-headroom: 0;

      /*
        A bigger tray than the rail it was written for: this one anchors the
        whole composition rather than sitting beside a poster. The controls
        grow with it - a 40px button in a 64px tray reads as a small thing in
        a large box.

        The bar keeps the live page's width: the mark-as-watched pill grows
        into it, and on a show that pill fills to show progress. Hugging the
        controls instead collapsed it to a bare circle with nothing to fill.
      */
      --summary-actions-bar-height: var(--ni-64);
      --summary-actions-bar-padding: var(--ni-8) var(--ni-8);
      --action-button-size: var(--ni-48);

      /* The marks match the taller tray's controls - same box, same hover. */
      --rating-badge-size: var(--ni-24);
      --rating-badge-box: var(--ni-48);
      --rating-badge-inset: 0;

      :global(.trakt-summary-actions-bar svg) {
        height: var(--ni-20);
      }

      @include for-mobile {
        /*
          Three items across a phone is a squeeze; the tray keeps the row and
          shrinks to the poster's measure, as it does elsewhere.
        */
        gap: var(--gap-s);
        padding-inline: var(--ni-8);

        --action-button-size: var(--ni-40);
      }
    }

    /*
      A hairline between each kind of answer - how you felt, what you can do,
      what you scored it. Both are conditional (reactions behind a flag, the
      score behind having watched it), so each divider hides when it would
      end up on the outside of the row rather than between two things.
    */
    .action-row-divider {
      width: var(--ni-1);
      height: var(--ni-24);
      flex: none;

      background: var(--color-hairline);

      &:first-child,
      &:last-child {
        display: none;
      }
    }

  }


</style>
