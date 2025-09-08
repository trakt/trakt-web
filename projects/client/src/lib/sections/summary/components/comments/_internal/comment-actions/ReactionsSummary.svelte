<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { ReactionSummary } from "../models/ReactionSummary";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "./constants";

  const { summary }: { summary: ReactionSummary } = $props();
</script>

<div class="trakt-reactions-summary">
  <div class="trakt-reaction-emojis">
    {#each summary.top as reaction, index}
      <ReactionEmoji
        code={REACTIONS_CODE_MAP[reaction]}
        label={reaction}
        {index}
      />
    {/each}
  </div>

  {#if summary.count > 0}
    <p class="smaller meta-info">
      {toHumanNumber(summary.count, getLocale())}
    </p>
  {/if}
</div>

<style>
  .trakt-reactions-summary {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
  }

  .trakt-reaction-emojis {
    display: flex;
    align-items: center;
  }
</style>
