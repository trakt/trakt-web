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
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import { useSocialActivities } from "../../_internal/useSocialActivities";
  import { useTrivia } from "../../trivia/useTrivia";
  import { useMediaAwards } from "../../awards/useMediaAwards";
  import { useMediaReactions } from "$lib/features/media-reactions/stores/useMediaReactions.ts";
  import MediaReactions from "$lib/features/media-reactions/MediaReactions.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RateNow from "../../rating/RateNow.svelte";
  import SummaryActions from "../../summary/SummaryActions.svelte";
  import SummaryOverview from "../../summary/SummaryOverview.svelte";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "../v2/_internal/MediaActions.svelte";
  import GlanceStrip from "./_internal/GlanceStrip.svelte";
  import SummaryHeaderKicker from "./_internal/SummaryHeaderKicker.svelte";
  import SummaryHeaderTitle from "../../header-kit/SummaryHeaderTitle.svelte";
  import { mapToSummaryHeaderFacts } from "./_internal/mapToSummaryHeaderFacts.ts";
  import { mapToSummaryHeaderKicker } from "./_internal/mapToSummaryHeaderKicker.ts";
  import { toHeaderProviders } from "./_internal/toHeaderProviders.ts";
  import { toSummarySentiment } from "./_internal/toSummarySentiment.ts";
  import type { SummaryHeaderProps } from "./SummaryHeaderProps.ts";

  /*
    Direction 1b - "Masthead".

    Same information as 1a, given a magazine-cover treatment: a backdrop band
    that dissolves into the card, the poster mounted over it, and centred
    masthead type. Below the rule the composition stops centring - the credits,
    listings and sentiment strip is left-aligned, because it reads as a ruled
    data strip rather than more centred prose.
  */
  const { intl, crew, streamOn, sentiment, ...target }: SummaryHeaderProps =
    $props();

  const media = $derived(target.media);
  const title = $derived(intl?.title ?? media?.title ?? "");
  const overview = $derived(intl.overview ?? media.overview);

  const kicker = $derived(mapToSummaryHeaderKicker(target));
  const status = $derived(toTranslatedStatus(media.status));
  const facts = $derived(mapToSummaryHeaderFacts(target));

  /* The strip leads with one provider; the glance drawer holds the rest. */
  const glanceProvider = $derived(toHeaderProviders(streamOn, 1).at(0) ?? null);
  const headerSentiment = $derived(toSummarySentiment(sentiment));

  /*
    Trivia is surfaced here rather than only at the foot of the page. Two facts,
    matching the other columns' density; the chevron opens the full drawer.
    Spoiler-flagged facts are excluded - the header is not somewhere a reader
    opts in to them.
  */
  const { summary: triviaSummary } = $derived(
    useTrivia({
      slug: media.slug,
      type: target.type,
      variant: "no-spoilers",
    }),
  );

  const { awards } = $derived(useMediaAwards({ slug: media.slug }));

  const { ratings, isLoading: isRatingsLoading } = $derived(
    useMediaMetaInfo(target),
  );

  const { watchCount } = $derived(useWatchCount(target));
  const { isDropped } = $derived(useIsDropped(media));
  const { isStarted } = $derived(useIsStarted(target));
  const { isRewatching } = $derived(useIsRewatching(target));
  const { isWatchlisted } = $derived(useIsWatchlisted(target));

  const { country } = useStreamingPreferences();

  const socialTarget = $derived({ type: target.type, slug: media.slug });
  const socialTarget$ = fromRune(() => socialTarget);
  const { entries: socialEntries } = useSocialActivities(socialTarget$);

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
    <SummaryHeaderTitle {title} />

    <div class="masthead-deck">
      <Spoiler {media} type={target.type}>
        <SummaryOverview {title} {overview} />
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
        <SummaryActions>
          <MediaActions {media} {title} />

          {#snippet contextualActions()}
            <!--
              Reactions share the line with the stars and the heart: rating, faving
              and reacting are the same gesture - a one-tap response to the title -
              so they read as one row of responses rather than as separate features.
            -->
            <div class="rate-and-react">
              <RateNow type={target.type} {media} style="minimal" />

              <RenderForFeature
                flag={FeatureFlag.Reactions}
                audience="director"
              >
                {#snippet enabled()}
                  <MediaReactions type={target.type} slug={media.slug} {title} />
                {/snippet}
              </RenderForFeature>
            </div>
          {/snippet}
        </SummaryActions>
      </div>
    </RenderFor>


    <!--
      The strip, folded to one line. Everything the five columns said is still
      referenced - release, listings, follows, sentiment, awards, reactions,
      trivia - but as tokens, because a full column of each right at the top of
      the page outweighed the page. The pill opens the at-a-glance drawer, where
      the sections appear at their old density and drill into their full views.
    -->
    <div class="masthead-glance">
      <GlanceStrip
        {...glanceLink}
        label={m.button_label_at_a_glance({ title })}
        release={glanceRelease}
        provider={glanceProvider}
        country={$country}
        social={glanceSocial}
        sentiment={headerSentiment}
        awardsCount={awards.length}
        reactions={glanceReactions}
        triviaCount={$triviaSummary.length}
      />
    </div>

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
    --masthead-poster-width: clamp(var(--ni-132), 18vw, var(--ni-220));
    --masthead-poster-height: calc(var(--masthead-poster-width) * 1.5);
    --masthead-rhythm: var(--gap-l);
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
      The side padding sets the centred measure, so it has to scale rather than sit
      at the 120px it was drawn with - at 1024px that alone ate a quarter of the
      window and squeezed the strip below into unreadable columns.
    */
    padding: 0 clamp(var(--gap-m), 8vw, var(--ni-120)) var(--ni-44);
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
    margin-top: var(--gap-xs);
    padding-top: var(--ni-24);

    border-top: var(--ni-1) solid var(--color-hairline);

    display: flex;
    justify-content: center;
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

    .rate-and-react {
      display: flex;
      align-items: center;
      justify-content: center;
      /* Wraps on narrow widths - the pill drops under the stars, still centred. */
      flex-wrap: wrap;
      gap: var(--gap-s) var(--gap-m);
    }
  }


</style>
