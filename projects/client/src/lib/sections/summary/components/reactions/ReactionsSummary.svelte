<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import ReactionEmoji from "./ReactionEmoji.svelte";

  const {
    top,
    count,
    density = "default",
  }: {
    top: Array<{ type: string; code: string }>;
    count: number;
    /**
     * `compact` overlaps the emojis and shrinks the count, for tight bars.
     * `stacked` piles them like avatars, front one fully visible, for the
     * narrowest bars.
     */
    density?: "default" | "compact" | "stacked";
  } = $props();
</script>

<div class="trakt-reactions-summary" data-density={density}>
  <div class="trakt-reaction-emojis">
    {#each top as reaction, index (reaction.type)}
      <ReactionEmoji code={reaction.code} label={reaction.type} {index} />
    {/each}
  </div>

  {#if count > 0}
    <p class="bold">
      {toHumanNumber(count, getLocale())}
    </p>
  {/if}
</div>

<style lang="scss">
  .trakt-reactions-summary {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }

  .trakt-reaction-emojis {
    display: flex;
    align-items: center;
  }

  .trakt-reactions-summary[data-density="compact"],
  .trakt-reactions-summary[data-density="stacked"] {
    gap: var(--ni-4);

    .trakt-reaction-emojis > :global(* + *) {
      margin-inline-start: var(--ni-neg-8);
    }

    p {
      font-size: var(--font-size-tag);
    }
  }

  .trakt-reactions-summary[data-density="stacked"] {
    .trakt-reaction-emojis > :global(*) {
      position: relative;
    }

    .trakt-reaction-emojis > :global(* + *) {
      margin-inline-start: var(--ni-neg-12);
    }

    // Front to back, so the top reaction is the one fully visible.
    .trakt-reaction-emojis > :global(:nth-child(1)) {
      z-index: 3;
    }
    .trakt-reaction-emojis > :global(:nth-child(2)) {
      z-index: 2;
    }
    .trakt-reaction-emojis > :global(:nth-child(3)) {
      z-index: 1;
    }
  }
</style>
