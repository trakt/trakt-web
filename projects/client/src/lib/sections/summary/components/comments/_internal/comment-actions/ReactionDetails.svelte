<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { REACTIONS_MAP } from "./constants";

  const {
    reaction,
    count,
    isCurrent,
  }: { reaction: Reaction; count: number; isCurrent: boolean } = $props();
</script>

<div class="trakt-reaction-details" class:is-current={isCurrent}>
  {REACTIONS_MAP[reaction]}
  <p class="small">{toHumanNumber(count, getLocale())}</p>
</div>

<style>
  .trakt-reaction-details {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);

    min-width: var(--ni-66);
    height: var(--ni-30);

    font-size: var(--ni-18);
    color: var(--color-foreground);

    box-sizing: border-box;
    padding: var(--ni-2) var(--ni-10);

    border-radius: var(--border-radius-xxl);

    transition: background-color var(--transition-increment) ease-in-out;

    p.small {
      font-weight: 600;
    }

    &.is-current {
      background-color: var(--color-current-reaction-background);
    }
  }
</style>
