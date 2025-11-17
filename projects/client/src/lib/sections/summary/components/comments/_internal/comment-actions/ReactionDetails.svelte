<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "./constants";

  const {
    reaction,
    count,
    isCurrent,
    index,
  }: { reaction: Reaction; count: number; isCurrent: boolean; index: number } =
    $props();
</script>

<div class="trakt-reaction-details" class:is-current={isCurrent}>
  <ReactionEmoji
    code={REACTIONS_CODE_MAP[reaction]}
    label={reaction}
    animation={isCurrent ? "infinite" : "none"}
    {index}
  />
  <p class="bold">{toHumanNumber(count, getLocale())}</p>
</div>

<style>
  .trakt-reaction-details {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);

    min-width: var(--ni-66);
    height: var(--ni-30);

    color: var(--color-foreground);

    box-sizing: border-box;
    padding: var(--ni-2) var(--ni-10);

    border-radius: var(--border-radius-xxl);

    transition: background-color var(--transition-increment) ease-in-out;

    &.is-current {
      background-color: var(--color-current-reaction-background);
    }
  }
</style>
