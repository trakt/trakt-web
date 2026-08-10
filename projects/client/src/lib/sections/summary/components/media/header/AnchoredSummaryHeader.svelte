<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import SocialActivitiesButton from "../../_internal/SocialActivitiesButton.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import RateNow from "../../rating/RateNow.svelte";
  import SummaryActions from "../../summary/SummaryActions.svelte";
  import SummaryOverview from "../../summary/SummaryOverview.svelte";
  import { useMediaAwards } from "../../awards/useMediaAwards";
  import MediaReactions from "$lib/features/media-reactions/MediaReactions.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import DetailsButton from "../v2/_internal/DetailsButton.svelte";
  import MediaActions from "../v2/_internal/MediaActions.svelte";
  import SummaryHeaderByline from "./_internal/SummaryHeaderByline.svelte";
  import SummaryHeaderFacts from "./_internal/SummaryHeaderFacts.svelte";
  import SummaryHeaderKicker from "./_internal/SummaryHeaderKicker.svelte";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";
  import SummaryHeaderSentiment from "./_internal/SummaryHeaderSentiment.svelte";
  import SummaryHeaderTitle from "./_internal/SummaryHeaderTitle.svelte";
  import SummaryHeaderAwards from "./_internal/SummaryHeaderAwards.svelte";
  import SummaryHeaderWatchOptions from "./_internal/SummaryHeaderWatchOptions.svelte";
  import { mapToSummaryHeaderFacts } from "./_internal/mapToSummaryHeaderFacts.ts";
  import { mapToSummaryHeaderKicker } from "./_internal/mapToSummaryHeaderKicker.ts";
  import { toHeaderProviders } from "./_internal/toHeaderProviders.ts";
  import { toSummarySentiment } from "./_internal/toSummarySentiment.ts";
  import type { SummaryHeaderProps } from "./SummaryHeaderProps.ts";

  /*
    Direction 1a - "Anchored".

    An evolution of the existing header. The fix is alignment: the poster and its
    controls sit in a left rail, and every block in the main column shares one
    left edge. Facts live inside a ruled frame, scores inside a bordered plate -
    nothing floats unattached, which was the original complaint.
  */
  const { intl, crew, streamOn, sentiment, ...target }: SummaryHeaderProps =
    $props();

  const media = $derived(target.media);
  const title = $derived(intl?.title ?? media?.title ?? "");
  const overview = $derived(intl.overview ?? media.overview);

  const kicker = $derived(mapToSummaryHeaderKicker(target));
  const facts = $derived(mapToSummaryHeaderFacts(target));
  const providers = $derived(toHeaderProviders(streamOn));
  const headerSentiment = $derived(toSummarySentiment(sentiment));

  /* Two, matching the rail's other sections - wins first, see useMediaAwards. */
  const HEADER_AWARDS_LIMIT = 2;
  const { awards } = $derived(useMediaAwards({ slug: media.slug }));
  const headerAwards = $derived(awards.slice(0, HEADER_AWARDS_LIMIT));

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
  const postCreditsCount = $derived(media.postCredits?.length ?? 0);

  const { buildDrawerLink } = summaryDrawerNavigation();
  const ratingsLink = $derived(buildDrawerLink(SummaryDrawers.Ratings));
  const whereToWatchLink = $derived(
    buildDrawerLink(SummaryDrawers.WhereToWatch),
  );
  const sentimentLink = $derived(buildDrawerLink(SummaryDrawers.Sentiment));

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

<article class="trakt-anchored-summary-header">
  <div class="header-rail">
    <!--
      The poster's sizing tokens live on this wrapper, not on the rail. On the rail
      they reached the action bar too, which sizes itself from --summary-poster-width
      below tablet-sm - so the bar inherited `100%` and grew as the window shrank
      while hugging its content on desktop. Backwards, and invisible on desktop.
    -->
    <div class="rail-poster">
      <SummaryPoster src={media.poster.url.medium} alt={title} {tags} />
    </div>

    <!--
      The live summary page's own composition: SummaryActions stacks the action bar
      with the rate row as its contextual actions. Reused rather than restated, so
      the two headers cannot drift from the shipped one on spacing or order.

      MediaActions brings its own SummaryActionsBar, popup and all - it was once
      wrapped in a second one here, which stacked two pill surfaces and left the
      visible bar at its default width while the tokens configured the wrapper.
    -->
    <RenderFor audience="authenticated">
      <div class="rail-actions">
        <SummaryActions>
          <MediaActions {media} {title} />

          {#snippet contextualActions()}
            <RateNow type={target.type} {media} />
          {/snippet}
        </SummaryActions>
      </div>
    </RenderFor>
  </div>

  <div class="header-main">
    <div class="header-identity">
      <SummaryHeaderKicker {kicker} />
      <SummaryHeaderTitle {title} />

      <!--
        The byline carries the details affordance, as the live header does next to
        its subtitle. Without it the details drawer - studios, networks, languages,
        links - has no route in from this header.
      -->
      <div class="header-byline-row">
        <SummaryHeaderByline type={target.type} {crew} />
        <DetailsButton style="action" size="small" {title} />
      </div>
    </div>

    <SummaryHeaderFacts {facts} />

    <div class="header-scores-row">
      <!--
        The shipped rating row, with each source's own logo. Sefer's call over the
        design's dot-and-label plate: the marks are recognisable at a glance where a
        text label has to be read.
      -->
      <RatingList
        ratings={$ratings}
        entry={media}
        drilldown={ratingsLink}
        isLoading={$isRatingsLoading}
      />

      <RenderFor audience="authenticated">
        <SocialActivitiesButton target={socialTarget} {title} />
      </RenderFor>
    </div>

    <div class="header-synopsis">
      <Spoiler {media} type={target.type}>
        <SummaryOverview {title} {overview} />
      </Spoiler>
    </div>

    <!--
      Reactions live in the main column, not the info rail: the rail is read-only
      reference material, and this is something to act on. It also sits below the
      synopsis so it reads as a response to the title rather than as another fact
      about it.
    -->
    <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
      {#snippet enabled()}
        <div class="header-reactions">
          <MediaReactions type={target.type} slug={media.slug} {title} />
        </div>
      {/snippet}
    </RenderForFeature>

  </div>

  <aside class="header-info-rail">
    <section class="rail-section">
      <SummaryHeaderSectionHeader
        title={m.list_title_where_to_watch()}
        detail={justWatchDetail}
        drilldown={{
          ...whereToWatchLink,
          label: m.button_label_view_all_where_to_watch(),
        }}
      />

      <SummaryHeaderWatchOptions {providers} country={$country} />
    </section>

    {#if headerSentiment}
      <section class="rail-section">
        <SummaryHeaderSectionHeader
          title={m.header_community_sentiment()}
          drilldown={{
            ...sentimentLink,
            label: m.button_label_view_sentiment_analysis(),
          }}
        />

        <SummaryHeaderSentiment sentiment={headerSentiment} />
      </section>
    {/if}

    <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
      {#snippet enabled()}
        {#if headerAwards.length > 0}
          <section class="rail-section">
            <SummaryHeaderSectionHeader title={m.header_awards()} />
            <SummaryHeaderAwards awards={headerAwards} />
          </section>
        {/if}
      {/snippet}
    </RenderForFeature>
  </aside>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-anchored-summary-header {
    /*
      Tune the header's presence with these two.

      No outer border on purpose: a hard frame made this the only boxed region on
      the page and competed with the rules that frame the facts strip and the
      scores plate inside it.

      The page sets an ambient cover image behind this card, so a faint tint just
      lets the artwork through unevenly and reads as muddy. Instead the header is
      a glass surface - mostly opaque, blurring what is behind it - so the cover
      becomes texture rather than noise. Lower the opacity to let more artwork
      through; raise it towards 100% for a flat panel.
    */
    --header-surface-opacity: 85%;
    --header-surface-blur: var(--ni-20);


    /*
      Fluid rather than fixed, because the fixed version only ever worked at the
      width it was drawn at. The rails were pinned at 264 and 300px with 40px gaps
      and padding, which at 1024px left the main column 188px to hold a 64px title.
      Sizing them from the viewport means every width in between is accounted for
      without a breakpoint per case.

      `vw` and not `%` deliberately: the sidebar can expand, so the header's own
      width changes at a fixed viewport width, and percentages would feed that
      change back into the rails.
    */
    --header-poster-rail: clamp(var(--ni-160), 19vw, var(--ni-264));
    --header-info-rail: clamp(var(--ni-240), 22vw, var(--ni-300));
    --header-gutter: clamp(var(--ni-20), 2.6vw, var(--ni-40));

    display: grid;
    grid-template-columns:
      var(--header-poster-rail)
      minmax(0, 1fr)
      var(--header-info-rail);
    gap: var(--header-gutter);
    align-items: start;

    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    margin: var(--gap-m) var(--layout-distance-side);
    padding: var(--header-gutter);

    border-radius: var(--border-radius-xl);
    background: color-mix(
      in srgb,
      var(--color-background) var(--header-surface-opacity),
      transparent
    );
    @include backdrop-filter-blur(var(--header-surface-blur));

    /*
      Three columns need roughly 1200px before the main column stops being the
      narrowest thing on screen. Below that the info rail drops beneath the main
      column and splits two-up, which buys the title and synopsis the full width.

      A raw query rather than a device mixin on purpose: this is a property of THIS
      layout's column budget, not of a device class, and the nearest mixin
      boundary (1023px) is far too late - the layout has already collapsed by then.
    */
    @media (max-width: 1200px) {
      grid-template-columns: var(--header-poster-rail) minmax(0, 1fr);
    }

    /*
      One column: below this the poster rail and the main column are competing for
      a width that cannot hold both.
    */
    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;

      margin-inline: var(--layout-distance-side);
      padding: var(--gap-m);
    }
  }

  .header-rail {
    display: flex;
    flex-direction: column;
    gap: var(--ni-14);

    /*
      Once the grid is a single column the rail would stretch to the full width and
      the poster would tower over everything, so it is capped and centred instead.
    */
    @include for-tablet-sm-and-below {
      /*
        The rail keeps the full width and centres its contents; only the poster is
        capped. Capping the rail itself squeezed the action bar with it.
      */
      width: 100%;
      align-items: center;
    }
  }

  .rail-poster {
    /* Fills the rail column and takes the design's tighter poster radius. */
    --summary-poster-width: 100%;
    --summary-poster-radius: var(--border-radius-m);

    /* Once the grid is one column, the poster would otherwise tower over everything. */
    @include for-tablet-sm-and-below {
      width: min(100%, var(--ni-200));
    }
  }

  .rail-actions {
    display: flex;
    justify-content: center;

    /* The rate row spans the rail rather than hugging its own content. */
    :global(.trakt-summary-actions) {
      width: 100%;
    }

    :global(.trakt-rate-now) {
      width: 100%;
      justify-content: space-between;
    }

  }


  .header-main {
    display: flex;
    flex-direction: column;
    /*
      One left edge for every block - the core fix. Nothing in this column is
      centred or indented.
      */
    align-items: stretch;
    gap: var(--ni-28);

    min-width: 0;
    width: 100%;

    /*
      The column's reading measure, shared by the prose and by the facts strip's
      rules so the two cannot drift apart.

      The `font-size` here is what makes that sharing exact: `ch` resolves against
      the element it is used on, so without a common basis 62ch on the strip and
      62ch on the synopsis would come out different widths. Every text child sets
      its own size, so this only establishes the unit - it changes nothing visually.
    */
    font-size: var(--ni-16);
    --header-measure: 62ch;
    --facts-measure: var(--header-measure);
  }

  .header-identity {
    display: flex;
    flex-direction: column;
    /*
      Tighter than the gaps between the column's blocks: kicker, title and byline
      are one unit - the title's identity - so they should read as a group rather
      than as three separately spaced rows.

      Note this lands wider than it looks on paper. The title's line box carries
      roughly 14px of empty space above its capitals and 13px below its baseline at
      these sizes, so the visible gap is this value plus that leading. The masthead
      trims that away with `text-box-trim`; here it is left in, which is why the
      number is small.
    */
    gap: var(--gap-xs);
  }

  .header-byline-row {
    display: flex;
    align-items: center;
    /* Reads as ~8px - the small ActionButton pulls itself in by 8px a side. */
    gap: var(--gap-m);
  }

  .header-scores-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-m);

    /* Keeps the activity pill on the plate's baseline at the shared height. */
    :global(.trakt-social-activities-button-link-wrapper) {
      align-self: center;
      margin-top: 0;
    }
  }

  .header-synopsis {
    /*
      The measure cap matters: a full-column-width synopsis is part of why the
      original header read as unstructured.
    */
    max-width: var(--header-measure);

    font-size: var(--ni-16);
    line-height: 1.65;
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }


  .header-info-rail {
    display: flex;
    flex-direction: column;
    gap: var(--ni-40);

    /*
      The rail's sections - where to watch, sentiment - also exist further down the
      page, and those render at tablet-lg and below. Showing both is how a narrow
      window ended up with each of them twice. Below desktop the rail yields
      entirely and the page's own sections carry them; the two gates are exact
      complements.
    */
    @include for-tablet-lg-and-below {
      display: none;
    }

    position: sticky;
    top: var(--gap-l);

    /*
      Matches the root's column-budget breakpoint: when the third column is
      dropped, the rail moves under the full width of the grid and its two sections
      sit side by side. Sticky has to go with it - the rail is no longer a column
      alongside the content, it is a row beneath it.
    */
    @media (max-width: 1200px) {
      position: static;

      grid-column: 1 / -1;
      flex-direction: row;
      align-items: flex-start;
      gap: var(--header-gutter);

      > :global(*) {
        flex: 1;
        min-width: 0;
      }
    }

    /* Two sections side by side stop fitting well before the grid does. */
    @include for-tablet-sm-and-below {
      flex-direction: column;
      gap: var(--ni-28);

      width: 100%;
    }
  }

  /*
    Unboxed, matching the masthead's strip: a label row, then the content. The
    framed panels read as two hard cards competing with the poster, which is what
    made the rail feel heavier than everything around it.
  */
  .header-reactions {
    display: flex;
  }

  .rail-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-14);

    min-width: 0;

    --sentiment-bullet-gap: var(--gap-xs);
  }
</style>
