<script lang="ts">
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import { reactionSentimentDefinitions } from "../reactionSentimentDefinitions.ts";

  const { sentiment }: { sentiment: ReactionSentiment } = $props();

  const definition = $derived(reactionSentimentDefinitions[sentiment]);
</script>

<span class="trakt-reaction-glyph" role="img" aria-label={definition.label()}>
  {definition.glyph}
</span>

<style lang="scss">
  .trakt-reaction-glyph {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-size: var(--reaction-glyph-size, 1.25em);
    line-height: 1;
    // Emoji are content, not text: keep them upright and unaffected by
    // surrounding font styling.
    font-style: normal;
    font-weight: 400;
  }
</style>
