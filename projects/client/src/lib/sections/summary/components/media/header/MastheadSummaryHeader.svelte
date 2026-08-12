<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus";
  import { untrack } from "svelte";
  import { of } from "rxjs";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import { useSocialActivities } from "../../_internal/useSocialActivities";
  import { useTrivia } from "../../trivia/useTrivia";
  import { useMediaAwards } from "../../awards/useMediaAwards";
  import { useMediaReactions } from "$lib/features/media-reactions/stores/useMediaReactions.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import RateNow from "../../rating/RateNow.svelte";
  import SummaryActions from "../../summary/SummaryActions.svelte";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "../v2/_internal/MediaActions.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GlanceDock from "./_internal/GlanceDock.svelte";
  import GlanceStrip from "./_internal/GlanceStrip.svelte";
  import SummaryHeaderByline from "./_internal/SummaryHeaderByline.svelte";
  import SummaryHeaderFacts from "../../header-kit/SummaryHeaderFacts.svelte";
  import SummaryHeaderKicker from "./_internal/SummaryHeaderKicker.svelte";
  import SummaryHeaderRecap from "./_internal/SummaryHeaderRecap.svelte";
  import { useShowProgress } from "$lib/stores/useShowProgress";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { IS_DEV } from "$lib/utils/env";
  import SwipeCarousel from "$lib/sections/profile/components/SwipeCarousel.svelte";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";
  import SummaryHeaderSentiment from "./_internal/SummaryHeaderSentiment.svelte";
  import SummaryHeaderSocialActivity from "./_internal/SummaryHeaderSocialActivity.svelte";
  import SummaryHeaderTrivia from "./_internal/SummaryHeaderTrivia.svelte";
  import SummaryHeaderAwards from "./_internal/SummaryHeaderAwards.svelte";
  import SummaryHeaderWatchOptions from "./_internal/SummaryHeaderWatchOptions.svelte";
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

  const STRIP_PAGE_SIZE = 4;

  /* Which carousel page is on screen - the dock's dots follow it. */
  let activeStripPage = $state(0);

  /* `?actions=fused` seats the stars on the action tray's own surface. */
  const actionsVariant = $derived(
    toHeaderActionsVariant(page.url.searchParams.get(HEADER_ACTIONS_PARAM)),
  );

  /* The pill leads with one provider; the columns show two. */
  const glanceProvider = $derived(toHeaderProviders(streamOn, 1).at(0) ?? null);
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

  /* The columns' display limits - the pill shows totals instead. */
  const HEADER_TRIVIA_LIMIT = 2;
  const triviaFacts = $derived($triviaSummary.slice(0, HEADER_TRIVIA_LIMIT));
  const HEADER_AWARDS_LIMIT = 2;
  const headerAwards = $derived(awards.slice(0, HEADER_AWARDS_LIMIT));

  /* The columns' two meta lines - the pill joins year and length instead. */
  const RELEASE_FACT_KEYS = ["year", "length", "certification"];
  const releaseFacts = $derived(
    facts.filter((fact) => RELEASE_FACT_KEYS.includes(fact.key)),
  );
  const classificationFacts = $derived(
    facts.filter((fact) => !RELEASE_FACT_KEYS.includes(fact.key)),
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

  /*
    Between seasons: the next episode opens a season the last one closed. The
    finished season's overview then takes the recap's blurb slot - the memory
    to jog is the season, not one episode.
  */
  const previousSeasonOverview = $derived.by(() => {
    const lastEpisode = $progress$?.lastEpisode;
    if (!$progress$ || !lastEpisode) return null;
    if (lastEpisode.season <= 0) return null;
    if ($progress$.season <= lastEpisode.season) return null;

    return seasons?.find((season) => season.number === lastEpisode.season)
      ?.overview ?? null;
  });

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

  const { summary: reactionSummary } = $derived(
    useMediaReactions({ type: target.type, slug: media.slug }),
  );
  const GLANCE_REACTION_GLYPHS = 3;
  const glanceReactions = $derived({
    top: [...reactionSummary.metrics]
      .sort((a, b) => b.count - a.count)
      .slice(0, GLANCE_REACTION_GLYPHS)
      .map((metric) => metric.sentiment),
    total: reactionSummary.totalCount,
  });

  /* "2025 · 9 episodes" - the release facts pre-joined for the strip. */
  const glanceRelease = $derived.by(() => {
    const parts = ["year", "length"]
      .map((key) => facts.find((fact) => fact.key === key))
      .map((fact) => fact?.inlineValue ?? fact?.value)
      .filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : null;
  });

  const postCreditsCount = $derived(media.postCredits?.length ?? 0);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsLink = $derived(buildDrawerLink(SummaryDrawers.Ratings));
  const glanceLink = $derived(buildDrawerLink(SummaryDrawers.Glance));
  const reactionsLink = $derived(buildDrawerLink(SummaryDrawers.Reactions));
  const awardsLink = $derived(buildDrawerLink(SummaryDrawers.Awards));
  const whereToWatchLink = $derived(
    buildDrawerLink(SummaryDrawers.WhereToWatch),
  );
  const sentimentLink = $derived(buildDrawerLink(SummaryDrawers.Sentiment));
  const socialLink = $derived(buildDrawerLink(SummaryDrawers.Social));
  const triviaLink = $derived(buildDrawerLink(SummaryDrawers.Trivia));
  const detailsLink = $derived(buildDrawerLink(SummaryDrawers.Details));
  const recapLink = $derived(buildDrawerLink(SummaryDrawers.Recap));

  const justWatchDetail = $derived.by(() => {
    const rank = streamOn?.services?.streamingRank?.current;
    return rank ? m.text_just_watch_rank({ rank }) : null;
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

<article class="trakt-masthead-summary-header">
  <div class="masthead-backdrop">
    <CrossOriginImage src={media.cover.url.medium} alt="" />
    <!--
      The overlay resolves to the card background so the band dissolves into the
      content rather than ending on a hard edge.
    -->
    <div class="backdrop-veil" aria-hidden="true"></div>
  </div>

  <div class="masthead-content">
    <div class="masthead-poster">
      <SummaryPoster src={media.poster.url.medium} alt={title} {tags} />
    </div>

    <SummaryHeaderKicker {kicker} {status} variant="inline" />

    <!--
      The scores read as part of the kicker's classification line - what it is,
      then how it stands - before the title takes over. Logos over
      dot-and-label, matching the anchored direction.
    -->
    <div class="masthead-scores">
      <RatingList
        ratings={$ratings}
        entry={media}
        drilldown={ratingsLink}
        isLoading={$isRatingsLoading}
      />
    </div>
    <!--
      The title is the biggest touch target on the page, so it earns the most
      wanted destination: the details drawer, where the full description now
      lives. Same target as the credits chevron and the glance release token.
    -->
    <div class="masthead-title-link">
      <Link
        href={detailsLink.href}
        color="inherit"
        label={m.button_label_details({ title })}
      >
        <SummaryHeaderTitle {title} />
      </Link>
    </div>

    <!--
      Two lines, then an ellipsis - the full text is one tap away in the
      details drawer (title, chevron or glance token). The old inline "+ more"
      expanded the card downward and pushed the actions off the fold.
    -->
    <div class="masthead-deck">
      <Spoiler {media} type={target.type}>
        <p class="deck-text">{overview}</p>
      </Spoiler>
    </div>

    <!--
      Actions sit directly under the deck, above the scores: they are the reason
      most people are on this page, and below the scores and the strip they fell
      under the fold.
    -->
    <RenderFor audience="authenticated">
      <!--
        The live summary page's own composition - SummaryActions stacking the bar with
        the rate row as its contextual actions - reused rather than restated.

        Two departures, both set in CSS rather than by rebuilding it: the stack is
        centred instead of start-aligned, and reversed so the rate row sits ABOVE the
        bar. The rate row only renders for rateable titles, so below the bar it pushed
        it off the centre line exactly when it appeared.
      -->
      <div class="masthead-actions">
        {#if actionsVariant === "fused"}
          <!--
            One tray: the stars share the action bar's dark surface, a hairline
            bar between them. The bar inside is still the stock component - only
            its shadow is suppressed, since a shadow inside a same-colour tray
            reads as a smudge.
          -->
          <div class="fused-tray">
            <RateNow type={target.type} {media} style="minimal" />
            <span class="fused-divider" aria-hidden="true"></span>
            <MediaActions {media} {title} />
          </div>
        {:else}
          <SummaryActions>
            <MediaActions {media} {title} />

            {#snippet contextualActions()}
              <RateNow type={target.type} {media} style="minimal" />
            {/snippet}
          </SummaryActions>
        {/if}
      </div>
    </RenderFor>


    {#if stripVariant === "columns"}
    {#snippet creditsColumn()}
      <div class="strip-column">
        <SummaryHeaderSectionHeader
          title={m.header_credits_and_details()}
          drilldown={{
            ...detailsLink,
            label: m.button_label_details({ title }),
          }}
        />
        <div class="strip-credits">
          <SummaryHeaderByline type={target.type} {crew} layout="stacked" />
          <SummaryHeaderFacts facts={releaseFacts} variant="inline" />
          <SummaryHeaderFacts facts={classificationFacts} variant="inline" />
        </div>
      </div>
    {/snippet}

    {#snippet watchColumn()}
      <div class="strip-column strip-column-borrowed">
        <SummaryHeaderSectionHeader
          title={m.list_title_where_to_watch()}
          detail={justWatchDetail}
          drilldown={{
            ...whereToWatchLink,
            label: m.button_label_view_all_where_to_watch(),
          }}
        />
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
          <SummaryHeaderSectionHeader
            title={m.header_recap()}
            drilldown={{
              ...recapLink,
              label: m.button_label_view_recap({ title }),
            }}
          />
          <SummaryHeaderRecap progress={$progress$} {previousSeasonOverview} />
        </div>
      {/if}
    {/snippet}

    {#snippet socialColumn()}
      <div class="strip-column strip-column-borrowed">
        <SummaryHeaderSectionHeader
          title={m.list_title_social_activity()}
          drilldown={{
            ...socialLink,
            label: m.button_label_view_all_social_activity(),
          }}
        />
        <SummaryHeaderSocialActivity entries={headerSocialEntries} />
      </div>
    {/snippet}

    {#snippet sentimentColumn()}
      {#if headerSentiment}
        <div class="strip-column strip-column-borrowed">
          <SummaryHeaderSectionHeader
            title={m.header_community_sentiment()}
            drilldown={{
              ...sentimentLink,
              label: m.button_label_view_sentiment_analysis(),
            }}
          />
          <SummaryHeaderSentiment sentiment={headerSentiment} />
        </div>
      {/if}
    {/snippet}

    {#snippet triviaColumn()}
      <div class="strip-column strip-column-borrowed strip-column-stretch">
        <SummaryHeaderSectionHeader
          title={m.list_title_trivia()}
          drilldown={{
            ...triviaLink,
            label: m.button_label_view_trivia(),
          }}
        />
        <SummaryHeaderTrivia facts={triviaFacts} />
      </div>
    {/snippet}

    <!-- Awards is not borrowed: it exists nowhere else on the page. -->
    {#snippet awardsColumn()}
      <div class="strip-column">
        <SummaryHeaderSectionHeader title={m.header_awards()} />
        <SummaryHeaderAwards awards={headerAwards} />
      </div>
    {/snippet}

    {@const otherColumns = [
      { key: "details", column: creditsColumn },
      { key: "watch", column: watchColumn },
      ...($isAuthorized && headerSocialEntries.length > 0
        ? [{ key: "social", column: socialColumn }]
        : []),
      ...(headerSentiment
        ? [{ key: "sentiment", column: sentimentColumn }]
        : []),
      ...($isAwardsEnabled && isDirector && headerAwards.length > 0
        ? [{ key: "awards", column: awardsColumn }]
        : []),
      ...(triviaFacts.length > 0
        ? [{ key: "trivia", column: triviaColumn }]
        : []),
    ]}
    {@const hasRecap = Boolean(
      $isAuthorized && $progress$ && $progress$.completed > 0,
    )}
    <!-- The recap closes the first page - your own standing sits by the turn. -->
    {@const stripColumns = hasRecap
      ? [
        ...otherColumns.slice(0, STRIP_PAGE_SIZE - 1),
        { key: "recap", column: recapColumn },
        ...otherColumns.slice(STRIP_PAGE_SIZE - 1),
      ]
      : otherColumns}
    {@const firstPage = stripColumns.slice(0, STRIP_PAGE_SIZE)}
    {@const secondPage = stripColumns.slice(STRIP_PAGE_SIZE)}

    {@const visibleKeys = new Set(
      (activeStripPage === 0 ? firstPage : secondPage).map(
        (entry) => entry.key,
      ),
    )}

    {#snippet stripPageOne()}
      <div class="strip-page">
        {#each firstPage as entry (entry.key)}
          {@render entry.column()}
        {/each}
      </div>
    {/snippet}

    {#snippet stripPageTwo()}
      <div class="strip-page">
        {#each secondPage as entry (entry.key)}
          {@render entry.column()}
        {/each}
      </div>
    {/snippet}

    <div class="masthead-strip">
      <!--
        Four columns per view on desktop, the profile header's own swipe
        carousel paging the rest. Below desktop the carousel would cram four
        sections into a phone, so the columns stack as before.
      -->
      <RenderFor audience="all" device={["desktop"]}>
        <!--
          The dock stands where the divider ruled: everything the title has,
          at a glimpse, dots under whatever the carousel is showing beneath.
        -->
        <div class="masthead-dock">
          <GlanceDock
            links={{
              details: detailsLink.href,
              whereToWatch: whereToWatchLink.href,
              social: socialLink.href,
              sentiment: sentimentLink.href,
              awards: awardsLink.href,
              reactions: reactionsLink.href,
              trivia: triviaLink.href,
              recap: recapLink.href,
            }}
            {title}
            release={glanceRelease}
            provider={glanceProvider}
            country={$country}
            social={glanceSocial}
            sentiment={headerSentiment}
            awardsCount={awards.length}
            reactions={glanceReactions}
            triviaCount={$triviaList.length}
            recap={hasRecap && $progress$
              ? { remaining: $progress$.remaining }
              : null}
            {visibleKeys}
          />
        </div>

        <!--
          Keyed by page count: the carousel captures its slide count once at
          mount, but the async sections land after mount and can grow one page
          into two - which left the next-arrow lit yet inert, stepping toward
          a page the store never learned about. A count change remounts it.
        -->
        {#key stripColumns.length > STRIP_PAGE_SIZE}
          <SwipeCarousel
            slides={secondPage.length > 0
              ? [stripPageOne, stripPageTwo]
              : [stripPageOne]}
            onSlideProgress={(progress) =>
              (activeStripPage = Math.round(progress))}
          />
        {/key}
      </RenderFor>

      <RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
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
    <div class="masthead-glance">
      <GlanceStrip
        links={{
          details: detailsLink.href,
          whereToWatch: whereToWatchLink.href,
          social: socialLink.href,
          sentiment: sentimentLink.href,
          awards: awardsLink.href,
          reactions: reactionsLink.href,
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
        reactions={glanceReactions}
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
        the gap above the card, the inset from the frame's top edge down to the
        poster, and the space between every block in the centred stack (poster,
        kicker, title, deck). Driving all three from one place is the point: as
        separate values they read as unrelated gaps, and any of them drifting
        breaks the even frame Sefer is after.
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
      The height term is the fold at work: on a 1080-tall screen min() hands
      the poster ~205px of width (~308 tall) where 18vw alone gave it the
      full 220x330. Wide AND tall monitors still get the ceiling.
    */
    --masthead-poster-width: clamp(
      var(--ni-132),
      min(18vw, 19vh),
      var(--ni-220)
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
    --masthead-backdrop-reveal: var(--masthead-rhythm);

    --backdrop-overlap: calc(-1 * var(--masthead-poster-height));
    --backdrop-height: calc(
      var(--masthead-poster-height) + var(--masthead-backdrop-reveal)
    );


    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    /* Same value as the frame-to-poster inset - see --masthead-rhythm. */
    margin: var(--masthead-rhythm) var(--layout-distance-side);

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

  .backdrop-veil {
    position: absolute;
    inset: 0;

    @include dissolve.backdrop-veil;
  }

  .masthead-content {
    position: relative;

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
  }

  .masthead-scores {
    /* Belongs to the kicker line above, not to the column's full beat. */
    margin-top: calc(var(--gap-xs) - var(--masthead-rhythm));
  }

  .masthead-title-link {
    :global(a) {
      text-decoration: none;
      color: inherit;
    }
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
    color: var(--color-text-secondary);
    text-wrap: pretty;
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

    /* The composition centres; the data does not. */
    text-align: start;

    /*
      Wider gutters than the profile header gives its carousel - there the
      carets frame a small card, here they frame a 1280px page and read as
      glued to the columns without the extra air.
    */
    :global(.trakt-swipe-carousel) {
      gap: var(--ni-32);
    }

    /*
      A longer, decelerating glide for the page turn. The profile's 250ms
      symmetric ease suits its small card; over a full-width page it reads
      as a snap.
    */
    :global(.swipe-carousel-track:not(.is-dragging)) {
      transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    :global(.swipe-carousel-item:not(.is-dragging)) {
      transition: opacity 480ms ease-out;
    }

    @media (prefers-reduced-motion: reduce) {
      :global(.swipe-carousel-track),
      :global(.swipe-carousel-item) {
        transition: none;
      }
    }
  }

  .masthead-dock {
    margin-bottom: var(--gap-m);
  }

  /*
    One carousel page: every section is a fixed quarter-width column, and the
    page CENTRES whatever it holds. Full pages are indistinguishable from the
    old grid; short pages sit balanced in the middle of the viewport instead
    of hugging the start with a dead zone - the masthead is a centred
    composition, and a left-hugging page fought it. Column widths never
    change between pages, so the turn reads as one uniform slide.
    (Spreading short pages to full width was tried; the titles resizing
    between pages read worse.)
  */
  .strip-page {
    display: flex;
    justify-content: center;
    gap: var(--ni-32);

    /*
      Weighted, not fixed: columns share the page by growth weight, so the
      section mix can vary - and it will, a lot - without any one combination
      going lopsided. Ordinary columns cap near a quarter; trivia carries 1.4x
      the weight and caps at a third, because its prose goes tall and upright
      in a quarter and that unbalances the whole band. Half was tried and was
      way too much.
    */
    > .strip-column {
      flex: 1 1 0;
      min-width: 0;
      max-width: calc((100% - 3 * var(--ni-32)) / 4);
    }

    > .strip-column-stretch {
      flex-grow: 1.4;
      max-width: calc((100% - 2 * var(--ni-32)) / 3);

      /*
        Alone on its page, the third-cap left one tight column adrift in an
        empty viewport, three words a line. With the page to itself it takes
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
    /* No dock below desktop - the rule keeps its old job here. */
    padding-top: var(--ni-24);
    border-top: var(--ni-1) solid var(--color-hairline);

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
  .strip-column-borrowed {
    @include for-tablet-lg-and-below {
      display: none;
    }
  }

  .strip-column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-14);

    min-width: 0;

    --sentiment-bullet-gap: var(--gap-xs);
  }

  .strip-credits {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
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

    /*
      Centred, in source order: the bar first, the rate-and-react row beneath
      it. Done here rather than by rebuilding SummaryActions, which is
      deliberately start-aligned for the rail it was written for.
    */
    :global(.trakt-summary-actions) {
      flex-direction: column;
      align-items: center;
      gap: var(--gap-m);
    }

    .fused-tray {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      /* The stock bar's own surface and radius, stretched around both halves. */
      background-color: var(--color-actions-bar-background);
      border-radius: var(--border-radius-l);
      padding-inline-start: var(--ni-20);

      /* Inside a same-colour tray the bar's lift reads as a smudge. */
      --summary-actions-bar-shadow: none;
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
  }


</style>
