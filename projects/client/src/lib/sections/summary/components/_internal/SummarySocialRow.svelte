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

    @include for-tablet-sm-and-below {
      align-self: center;
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
