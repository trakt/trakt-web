<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { reactionSentimentDefinitions } from "../reactionSentimentDefinitions.ts";
  import type { ReactionChipProps } from "./ReactionChipProps.ts";
  import ReactionGlyph from "./ReactionGlyph.svelte";

  const { sentiment, count, selected, onclick }: ReactionChipProps = $props();

  const definition = $derived(reactionSentimentDefinitions[sentiment]);
</script>

<button
  type="button"
  class="trakt-reaction-chip"
  class:is-selected={selected}
  data-tone={definition.tone}
  aria-label={m.reactions_chip_label({ sentiment: definition.label(), count })}
  aria-pressed={selected}
  {onclick}
>
  <ReactionGlyph {sentiment} />
  <span class="chip-label">{definition.label()}</span>
  <span class="chip-count bold">{count}</span>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reaction-chip {
    --chip-accent: var(--color-text-secondary);

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding-block: var(--ni-6);
    padding-inline: var(--ni-12);

    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--chip-accent) 35%, transparent);
    border-radius: var(--border-radius-xl);
    background: color-mix(in srgb, var(--chip-accent) 8%, transparent);
    color: var(--color-text-primary);

    cursor: pointer;
    transition: background var(--transition-increment) ease-in-out,
      border-color var(--transition-increment) ease-in-out,
      transform var(--transition-increment) ease-in-out;

    &[data-tone="positive"] {
      --chip-accent: var(--green-500);
    }

    &[data-tone="divisive"] {
      --chip-accent: var(--orange-500);
    }

    &[data-tone="negative"] {
      --chip-accent: var(--red-500);
    }

    &.is-selected {
      border-color: var(--chip-accent);
      background: color-mix(in srgb, var(--chip-accent) 18%, transparent);
    }

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--chip-accent) 16%, transparent);
        border-color: color-mix(in srgb, var(--chip-accent) 60%, transparent);
      }
    }

    &:active {
      transform: scale(0.97);
    }

    .chip-label {
      font-size: var(--font-size-text);
      white-space: nowrap;
    }

    .chip-count {
      color: var(--chip-accent);
      font-variant-numeric: tabular-nums;
    }
  }
</style>
