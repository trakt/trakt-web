<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import LikeCommentAction from "./LikeCommentAction.svelte";
  import ReactButton from "./ReactButton.svelte";
  import ReactionsSummaryButton from "./ReactionsSummaryButton.svelte";

  const { comment }: { comment: MediaComment } = $props();
</script>

<RenderForFeature flag={FeatureFlag.Reactions}>
  {#snippet enabled()}
    <div class="trakt-react-action">
      <RenderFor audience="authenticated">
        <ReactButton {comment} />
      </RenderFor>

      <ReactionsSummaryButton {comment} />
    </div>
  {/snippet}

  <LikeCommentAction {comment} />
</RenderForFeature>

<style>
  .trakt-react-action {
    display: flex;
    align-items: center;

    gap: var(--gap-xxs);
  }
</style>
