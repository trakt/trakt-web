<script lang="ts">
  import { getLocale } from "$lib/features/i18n/index.ts";
  import type { AnyReaction } from "$lib/requests/models/AnyReaction.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toTranslatedReaction } from "$lib/utils/formatting/string/toTranslatedReaction.ts";
  import ReactionEmoji from "$lib/components/reactions/ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "./constants.ts";

  const {
    reaction,
    count,
    isCurrent,
    index,
  }: {
    reaction: AnyReaction;
    count: number;
    isCurrent: boolean;
    index: number;
  } =
    $props();
</script>

<div class="trakt-reaction-details" class:is-current={isCurrent}>
  <ReactionEmoji
    code={REACTIONS_CODE_MAP[reaction]}
    label={toTranslatedReaction(reaction)}
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
