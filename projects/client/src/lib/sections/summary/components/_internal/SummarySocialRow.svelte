<script lang="ts">
  import MediaReactionsBadge from "$lib/features/media-reactions/MediaReactionsBadge.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import WatchingNowSummaryPill from "$lib/sections/watching-now/WatchingNowSummaryPill.svelte";
  import SocialActivitiesButton from "./SocialActivitiesButton.svelte";
  import type { SummarySocialRowProps } from "./SummarySocialRowProps.ts";

  const { type, slug, id, title, extra }: SummarySocialRowProps = $props();
</script>

<div class="trakt-summary-social-row">
  {#key `${type}:${slug}`}
    <MediaReactionsBadge {type} {slug} {id} />
  {/key}

  <SocialActivitiesButton target={{ type, slug }} {title} />

  <RenderFor audience="authenticated">
    <WatchingNowSummaryPill target={{ type, slug }} {title} />
  </RenderFor>
  {@render extra?.()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-social-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);

    align-self: flex-start;
    margin-top: var(--gap-xxs);

    :global(.trakt-reactions-popover-trigger) {
      margin-inline-start: calc(-1 * var(--ni-12));
    }

    @include for-tablet-sm-and-below {
      align-self: center;
      justify-content: center;

      :global(.trakt-reactions-popover-trigger) {
        margin-inline-start: 0;
      }
    }

    :global(.trakt-social-activities-button-link-wrapper) {
      align-self: center;
      margin-top: 0;
    }
  }
</style>
