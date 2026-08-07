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
  import SummaryActionsBar from "../../_internal/SummaryActionsBar.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import { useSocialActivities } from "../../_internal/useSocialActivities";
  import { useTrivia } from "../../trivia/useTrivia";
  import RateNow from "../../rating/RateNow.svelte";
  import SummaryOverview from "../../summary/SummaryOverview.svelte";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "../v2/_internal/MediaActions.svelte";
  import SummaryHeaderByline from "./_internal/SummaryHeaderByline.svelte";
  import SummaryHeaderFacts from "./_internal/SummaryHeaderFacts.svelte";
  import SummaryHeaderKicker from "./_internal/SummaryHeaderKicker.svelte";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";
  import SummaryHeaderSentiment from "./_internal/SummaryHeaderSentiment.svelte";
  import SummaryHeaderSocialActivity from "./_internal/SummaryHeaderSocialActivity.svelte";
  import SummaryHeaderTitle from "./_internal/SummaryHeaderTitle.svelte";
  import SummaryHeaderTrivia from "./_internal/SummaryHeaderTrivia.svelte";
  import SummaryHeaderWatchOptions from "./_internal/SummaryHeaderWatchOptions.svelte";
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

  /*
    The credits column reads as two meta lines rather than one long run: the
    release facts, then what the title is and where it stands. That gives the
    column the vertical lines it needs to sit level with the other two.
  */
  const RELEASE_FACT_KEYS = ["year", "length", "certification"];
  const releaseFacts = $derived(
    facts.filter((fact) => RELEASE_FACT_KEYS.includes(fact.key)),
  );
  const classificationFacts = $derived(
    facts.filter((fact) => !RELEASE_FACT_KEYS.includes(fact.key)),
  );

  /* Two, not three - see toHeaderProviders. The chevron opens the rest. */
  const providers = $derived(toHeaderProviders(streamOn, 2));
  const headerSentiment = $derived(toSummarySentiment(sentiment));

  /*
    Trivia is surfaced here rather than only at the foot of the page. Two facts,
    matching the other columns' density; the chevron opens the full drawer.
    Spoiler-flagged facts are excluded - the header is not somewhere a reader
    opts in to them.
  */
  const HEADER_TRIVIA_LIMIT = 2;
  const { summary: triviaSummary } = $derived(
    useTrivia({
      slug: media.slug,
      type: target.type,
      variant: "no-spoilers",
    }),
  );
  const triviaFacts = $derived($triviaSummary.slice(0, HEADER_TRIVIA_LIMIT));

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

  /* Enough to give the column body without unbalancing the strip. */
  const HEADER_SOCIAL_LIMIT = 3;
  const headerSocialEntries = $derived(
    $socialEntries.slice(0, HEADER_SOCIAL_LIMIT),
  );

  const postCreditsCount = $derived(media.postCredits?.length ?? 0);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsLink = $derived(buildDrawerLink(SummaryDrawers.Ratings));
  const whereToWatchLink = $derived(
    buildDrawerLink(SummaryDrawers.WhereToWatch),
  );
  const sentimentLink = $derived(buildDrawerLink(SummaryDrawers.Sentiment));
  const socialLink = $derived(buildDrawerLink(SummaryDrawers.Social));
  const triviaLink = $derived(buildDrawerLink(SummaryDrawers.Trivia));
  /*
    Keeps the affordance the live header has as an "i" next to the genre: the
    details drawer holds studios, networks, languages, links and the rest, none of
    which fits in the header itself.
  */
  const detailsLink = $derived(buildDrawerLink(SummaryDrawers.Details));

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
      <div class="masthead-actions">
        <!--
          Stars and favourite sit ABOVE the action bar, not beside it. The rate row
          only appears once a title is rateable, so as a sibling it pushed the
          action bar off the composition's centre exactly when it showed up - the
          bar has to hold the centre line whether or not it is there.
        -->
        <div class="actions-rate">
          <RateNow type={target.type} {media} style="minimal" />
        </div>

        <SummaryActionsBar>
          <MediaActions {media} {title} />
        </SummaryActionsBar>
      </div>
    </RenderFor>

    <!-- Logos over dot-and-label, matching the anchored direction. -->
    <RatingList
      ratings={$ratings}
      entry={media}
      drilldown={ratingsLink}
      isLoading={$isRatingsLoading}
    />

    <div class="masthead-strip">
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

      <div class="strip-column">
        <SummaryHeaderSectionHeader
          title={m.list_title_where_to_watch()}
          detail={justWatchDetail}
          drilldown={{
            ...whereToWatchLink,
            label: m.button_label_view_all_where_to_watch(),
          }}
        />
        <SummaryHeaderWatchOptions
          {providers}
          country={$country}
        />
      </div>

      <RenderFor audience="authenticated">
        {#if headerSocialEntries.length > 0}
          <div class="strip-column">
            <SummaryHeaderSectionHeader
              title={m.list_title_social_activity()}
              drilldown={{
                ...socialLink,
                label: m.button_label_view_all_social_activity(),
              }}
            />
            <SummaryHeaderSocialActivity entries={headerSocialEntries} />
          </div>
        {/if}
      </RenderFor>

      {#if headerSentiment}
        <div class="strip-column">
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

      {#if triviaFacts.length > 0}
        <div class="strip-column">
          <SummaryHeaderSectionHeader
            title={m.list_title_trivia()}
            drilldown={{
              ...triviaLink,
              label: m.button_label_view_trivia(),
            }}
          />
          <SummaryHeaderTrivia facts={triviaFacts} />
        </div>
      {/if}
    </div>

  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    Eased alpha ramps for the backdrop dissolve.

    A gradient with only a handful of stops interpolates linearly between them, so
    the RATE of change jumps at every stop and at both ends. The eye reads those
    jumps as banding - a visible crease where the artwork starts fading and an arc
    where it stops. Both showed up on light artwork.

    These follow a smoothstep curve (3t^2 - 2t^3) sampled at ten points, which has
    zero derivative at each end. The fade therefore eases out of full opacity and
    into full transparency instead of starting and stopping abruptly.

    Positions are percentages of the radial field, matching the mask's ellipse, and
    both ramps land on zero at the same point - see the veil for why that matters.

    Black here is alpha data for a mask, not a themeable colour.
  */
  $backdrop-mask-stops:
    rgba(0, 0, 0, 1) 58%,
    rgba(0, 0, 0, 0.97) 62%,
    rgba(0, 0, 0, 0.9) 65%,
    rgba(0, 0, 0, 0.78) 69%,
    rgba(0, 0, 0, 0.65) 72%,
    rgba(0, 0, 0, 0.5) 76%,
    rgba(0, 0, 0, 0.35) 80%,
    rgba(0, 0, 0, 0.22) 83%,
    rgba(0, 0, 0, 0.1) 87%,
    rgba(0, 0, 0, 0.03) 90%,
    rgba(0, 0, 0, 0) 94%;

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

    /*
      Shared by the strip's rules and the scores dividers, matching the anchored
      direction so both read at the same weight.
    */
    --summary-header-hairline: color-mix(
      in srgb,
      var(--color-foreground) 7%,
      transparent
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
    content: "";

    position: absolute;
    inset: 0;
    z-index: var(--layer-raised);

    border-radius: inherit;
    padding: var(--ni-1);

    background: linear-gradient(
      180deg,
      var(--color-border) 0%,
      transparent var(--header-stroke-fade, 65%)
    );

    /* Punches out the interior, leaving only the 1px edge painted. */
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;

    pointer-events: none;
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
      mask-image: radial-gradient(
        var(--backdrop-fade-spread, 100%) var(--backdrop-fade-depth, 105%) at 50%
          0%,
        #{$backdrop-mask-stops}
      );
      -webkit-mask-image: radial-gradient(
        var(--backdrop-fade-spread, 100%) var(--backdrop-fade-depth, 105%) at 50%
          0%,
        #{$backdrop-mask-stops}
      );
    }
  }

  .backdrop-veil {
    position: absolute;
    inset: 0;

    /*
      Legibility only - the image's mask handles the dissolve now.

      Shares the mask's elliptical geometry rather than fading `to bottom`: a linear
      scrim over a curved dissolve would put its own straight edge back on the band.

      It also eases out on the same curve and lands on zero at the same 94% as the
      mask. That alignment is the fix for the bright arc: previously the scrim
      cleared at 82% while the artwork was still fully opaque, so the image's real
      brightness was revealed in one sweep. Now the scrim lifts exactly as the
      artwork dims, and both reach nothing together - so there is no moment where
      undimmed artwork appears, and no leftover tint on the bare card.
    */
    background: radial-gradient(
      var(--backdrop-fade-spread, 100%) var(--backdrop-fade-depth, 105%) at 50% 0%,
      color-mix(in srgb, var(--shade-950) 28%, transparent) 0%,
      color-mix(in srgb, var(--shade-950) 28%, transparent) 40%,
      color-mix(in srgb, var(--shade-950) 25%, transparent) 51%,
      color-mix(in srgb, var(--shade-950) 18%, transparent) 61%,
      color-mix(in srgb, var(--shade-950) 14%, transparent) 67%,
      color-mix(in srgb, var(--shade-950) 10%, transparent) 72%,
      color-mix(in srgb, var(--shade-950) 6%, transparent) 78%,
      color-mix(in srgb, var(--shade-950) 3%, transparent) 83%,
      color-mix(in srgb, var(--shade-950) 1%, transparent) 89%,
      transparent 94%
    );
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

  .masthead-deck {
    max-width: 58ch;

    /* Larger than 1a's synopsis - it carries the centred composition. */
    font-size: var(--ni-20);
    line-height: 1.55;
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }

  .masthead-strip {
    width: 100%;
    margin-top: var(--gap-xs);
    padding-top: var(--ni-24);

    border-top: var(--ni-1) solid var(--summary-header-hairline);

    /*
      Auto-flow rather than a fixed column count: sentiment and social activity
      both drop out when there is nothing to show (no analysis, or a signed-out
      visitor), and this keeps the remaining columns equal and full-width instead
      of leaving an empty cell behind.
    */
    /*
      `auto-fit` + `minmax`, which solves two problems with one rule.

      Column COUNT is not fixed: sentiment, social activity and trivia each drop out
      when there is nothing to show, and auto-fit keeps whatever survives equal and
      full-width rather than leaving a dead cell.

      Column WIDTH now has a floor. The previous `auto-flow: column` could not wrap,
      so five columns stayed five columns however narrow the window got - at 1024px
      that was 109px each. With a floor they wrap onto as many rows as they need,
      which is the behaviour that holds from a phone to an ultrawide without a
      breakpoint per case.
    */
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--strip-column-min, var(--ni-200)), 1fr)
    );
    gap: var(--ni-32);

    /* The composition centres; the data does not. */
    text-align: start;

    @include for-tablet-sm-and-below {
      gap: var(--gap-l);
      /* One column: below this even two columns cannot hold a provider row. */
      --strip-column-min: 100%;
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
    gap: var(--gap-m);

    margin-top: var(--gap-xxs);

    --action-button-size: var(--ni-48);
    --summary-actions-bar-height: var(--ni-56);
  }

  .actions-rate {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
