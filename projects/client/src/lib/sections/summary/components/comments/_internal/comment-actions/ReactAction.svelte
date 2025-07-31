<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import LikeCommentAction from "./LikeCommentAction.svelte";
  import ReactionPopupMenu from "./ReactionPopupMenu.svelte";
  import ReactionsSummary from "./ReactionsSummary.svelte";

  const { comment }: { comment: MediaComment } = $props();
</script>

<RenderForFeature flag={FeatureFlag.Reactions}>
  {#snippet enabled()}
    <RenderFor audience="public">
      <ReactionsSummary {comment} />
    </RenderFor>

    <RenderFor audience="authenticated">
      <ReactionPopupMenu {comment} />
    </RenderFor>
  {/snippet}

  <LikeCommentAction {comment} />
</RenderForFeature>
