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
  import SummaryActionsBar from "../../_internal/SummaryActionsBar.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import { useIsStarted } from "../../_internal/useIsStarted";
  import RateNow from "../../rating/RateNow.svelte";
  import SummaryOverview from "../../summary/SummaryOverview.svelte";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import DetailsButton from "../v2/_internal/DetailsButton.svelte";
  import MediaActions from "../v2/_internal/MediaActions.svelte";
  import SummaryHeaderByline from "./_internal/SummaryHeaderByline.svelte";
  import SummaryHeaderFacts from "./_internal/SummaryHeaderFacts.svelte";
  import SummaryHeaderKicker from "./_internal/SummaryHeaderKicker.svelte";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";
  import SummaryHeaderSentiment from "./_internal/SummaryHeaderSentiment.svelte";
  import SummaryHeaderTitle from "./_internal/SummaryHeaderTitle.svelte";
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
    <SummaryPoster src={media.poster.url.medium} alt={title} {tags} />

    <RenderFor audience="authenticated">
      <div class="rail-actions">
        <SummaryActionsBar>
          <MediaActions {media} {title} />
        </SummaryActionsBar>
      </div>

      <div class="rail-rate">
        <RateNow type={target.type} {media} />
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
      Every rule inside this header - the facts strip's two, the scores plate's
      cell dividers - resolves through this one value, so they stay in step. Well
      below --color-border on purpose: these separate content, they should not
      compete with it. Raise the percentage to make the structure more explicit.
    */
    --summary-header-hairline: color-mix(
      in srgb,
      var(--color-foreground) 7%,
      transparent
    );

    display: grid;
    grid-template-columns: var(--ni-264) minmax(0, 1fr) var(--ni-300);
    gap: var(--ni-40);
    align-items: start;

    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    margin: var(--gap-m) var(--layout-distance-side);
    padding: var(--ni-40);

    border-radius: var(--border-radius-xl);
    background: color-mix(
      in srgb,
      var(--color-background) var(--header-surface-opacity),
      transparent
    );
    @include backdrop-filter-blur(var(--header-surface-blur));

    /*
      Below desktop the info rail drops under the main column as a two-up row;
      the poster rail and main column keep their relationship.
    */
    @include for-tablet-lg {
      grid-template-columns: var(--ni-200) minmax(0, 1fr);
      gap: var(--ni-28);
      padding: var(--ni-28);
    }
  }

  .header-rail {
    display: flex;
    flex-direction: column;
    gap: var(--ni-14);

    /* Fills the rail column and takes the design's tighter poster radius. */
    --summary-poster-width: 100%;
    --summary-poster-radius: var(--border-radius-m);
  }

  .rail-actions {
    --summary-actions-bar-width: 100%;
    /* Raises the tray's controls to the 48px hit-target floor. */
    --action-button-size: var(--ni-48);
  }

  .rail-rate {
    display: flex;
    padding: 0 var(--gap-xxs);

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

    position: sticky;
    top: var(--gap-l);

    @include for-tablet-lg {
      position: static;

      grid-column: 1 / -1;
      flex-direction: row;
      align-items: flex-start;

      > :global(*) {
        flex: 1;
        min-width: 0;
      }
    }
  }

  /*
    Unboxed, matching the masthead's strip: a label row, then the content. The
    framed panels read as two hard cards competing with the poster, which is what
    made the rail feel heavier than everything around it.
  */
  .rail-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-14);

    min-width: 0;

    --sentiment-bullet-gap: var(--gap-xs);
  }
</style>
