<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import LikeCommentAction from "./LikeCommentAction.svelte";
  import ReactButton from "./ReactButton.svelte";

  const { comment }: { comment: MediaComment } = $props();
</script>

<RenderForFeature flag={FeatureFlag.Reactions}>
  {#snippet enabled()}
    <ReactButton {comment} />
  {/snippet}

  <LikeCommentAction {comment} />
</RenderForFeature>
