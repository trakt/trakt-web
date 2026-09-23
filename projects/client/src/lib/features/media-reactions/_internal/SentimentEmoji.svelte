<script lang="ts">
  import ReactionEmoji from "$lib/components/reactions/ReactionEmoji.svelte";
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import { reactionSentimentDefinitions } from "../reactionSentimentDefinitions.ts";

  /*
    Binds the media taxonomy to the shared emoji renderer.

    This is an adapter, not a component: the ONLY thing it adds is the
    sentiment -> code lookup, because the shared renderer deliberately knows
    nothing about either taxonomy. The comment stack reaches ReactionEmoji
    through its own map the same way.
  */
  const { sentiment }: { sentiment: ReactionSentiment } = $props();

  const definition = $derived(reactionSentimentDefinitions[sentiment]);
</script>

<span class="trakt-sentiment-emoji">
  <ReactionEmoji code={definition.code} label={definition.label()} />
</span>

<style lang="scss">
  .trakt-sentiment-emoji {
    /*
      Inline decoration rather than a tap target, so the box IS the artwork -
      callers size both with one hook. The picker, which does want a generous
      target, sets --reaction-emoji-box back itself.
    */
    --reaction-emoji-box: var(--reaction-emoji-size, var(--ni-18));

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>
