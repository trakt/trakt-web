<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import ReactionPopupMenu from "./ReactionPopupMenu.svelte";
  import ReactionsSummary from "./ReactionsSummary.svelte";

  const { comment }: { comment: MediaComment } = $props();
</script>

<RenderFor audience="public">
  <ReactionsSummary {comment} />
</RenderFor>

<RenderFor audience="authenticated">
  <ReactionPopupMenu {comment} />
</RenderFor>
