<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import MediaReactionsBadge from "$lib/features/media-reactions/MediaReactionsBadge.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import SocialActivitiesButton from "./SocialActivitiesButton.svelte";
  import type { SummarySocialRowProps } from "./SummarySocialRowProps.ts";

  const {
    type,
    slug,
    id,
    title,
  }: SummarySocialRowProps = $props();
</script>

<div class="trakt-summary-social-row">
  <RenderForFeature flag={FeatureFlag.Reactions}>
    {#snippet enabled()}
      <MediaReactionsBadge {type} {slug} {id} />
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

    align-self: flex-start;
    margin-top: var(--gap-xxs);

    :global(.trakt-reactions-popover-trigger) {
      margin-inline-start: calc(-1 * var(--ni-12));
    }

    @include for-tablet-sm-and-below {
      align-self: center;

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
