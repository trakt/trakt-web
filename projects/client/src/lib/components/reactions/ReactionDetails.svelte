<script lang="ts" generics="T extends AnyReaction">
  import type { AnyReaction } from "$lib/requests/models/AnyReaction.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toTranslatedReaction } from "$lib/utils/formatting/string/toTranslatedReaction.ts";
  import ReactionEmoji from "$lib/components/reactions/ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "./constants.ts";
  import type { ReactionDetailsProps } from "./ReactionDetailsProps.ts";

  const { reaction, count, isCurrent, index, onRemove }: ReactionDetailsProps<T> =
    $props();

  const label = $derived(toTranslatedReaction(reaction));
</script>

{#snippet content()}
  <ReactionEmoji
    code={REACTIONS_CODE_MAP[reaction]}
    {label}
    animation={isCurrent ? "infinite" : "none"}
    {index}
  />
  <p class="bold">{toHumanNumber(count, getLocale())}</p>
{/snippet}

{#if isCurrent && onRemove}
  <button
    type="button"
    class="trakt-reaction-details is-current is-removable"
    aria-label={m.button_label_remove_reaction({ reaction: label })}
    onclick={() => onRemove(reaction)}
  >
    {@render content()}
  </button>
{:else}
  <div class="trakt-reaction-details" class:is-current={isCurrent}>
    {@render content()}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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

  .is-removable {
    border: none;
    font: inherit;

    cursor: pointer;

    @include for-mouse {
      &:hover {
        background-color: var(--color-reaction-background-hover);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
    }
  }
</style>
