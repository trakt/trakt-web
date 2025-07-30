<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { REACTIONS_MAP } from "./constants";
  import { useCommentReactions } from "./useCommentReactions";

  const { comment }: { comment: MediaComment } = $props();

  const { reactions } = $derived(useCommentReactions({ id: comment.id }));
</script>

<div class="trakt-reactions-summary">
  {$reactions.top.map((reaction) => REACTIONS_MAP[reaction]).join(" ")}
  {#if $reactions.restCount > 0}
    <span class="meta-info secondary">+{$reactions.restCount}</span>
  {/if}

  {#if $reactions.top.length === 0}
    <span class="meta-info secondary">{m.text_zero_reactions()}</span>
  {/if}
</div>

<style>
  .trakt-reactions-summary {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    background-color: var(--color-reactions-preview-background);
    transition: background-color var(--transition-increment) ease-in-out;

    border-radius: var(--border-radius-xxl);
    padding: var(--ni-4) var(--ni-12);

    user-select: none;
  }
</style>
