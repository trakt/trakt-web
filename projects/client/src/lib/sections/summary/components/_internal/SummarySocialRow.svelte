<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import MediaReactionsBadge from "$lib/features/media-reactions/MediaReactionsBadge.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import SocialActivitiesButton from "./SocialActivitiesButton.svelte";

  /*
    The two readings of the room a title carries, on one line: how everyone
    felt about it, then who you follow that has seen it.

    They share a row rather than stacking because they answer the same
    question from two sides, and because the header is a column of single
    lines - a second one here pushed the overview further down the page for
    something that fits beside what is already there.

    Reactions lead. `padding-inline-start` in the flow direction, so the RTL
    locales get them on the right without a second rule.
  */
  const {
    type,
    slug,
    title,
  }: {
    type: MediaType;
    slug: string;
    title: string;
  } = $props();
</script>

<div class="trakt-summary-social-row">
  <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
    {#snippet enabled()}
      <MediaReactionsBadge {type} {slug} />
    {/snippet}
  </RenderForFeature>

  <SocialActivitiesButton target={{ type, slug }} {title} />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-social-row {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    /*
      The placement the social pill carries on its own, lifted to the row: with
      two things on the line, whatever owns the line has to own where it sits.
    */
    align-self: flex-start;
    margin-top: var(--gap-xxs);

    /*
      The badge buys its hover wash with 12px of inline padding, which put its
      first glyph 12px past the title above and the overview below - the only
      thing in the column not starting on the column's edge.

      The padding stays, because the wash needs it; the box is pulled back by
      the same amount instead. The lit surface then reaches into the gutter,
      which is what a padded hover target is supposed to do, and the ink lines
      up with everything stacked around it.
    */
    :global(.trakt-reactions-popover-trigger) {
      margin-inline-start: calc(-1 * var(--ni-12));
    }

    @include for-tablet-sm-and-below {
      align-self: center;

      /* Centred at this size rather than start-aligned, and there is no
         column edge to meet - a pull would only sit the row off centre by
         half of it. */
      :global(.trakt-reactions-popover-trigger) {
        margin-inline-start: 0;
      }
    }

    /*
      And taken back off the pill, which still places itself for the episode
      surfaces that mount it alone. Left on, its own top margin dropped it four
      pixels below the badge and its `flex-start` pinned it to the top of the
      row - two rules written for a column, read inside a row.
    */
    :global(.trakt-social-activities-button-link-wrapper) {
      align-self: center;
      margin-top: 0;
    }
  }
</style>
