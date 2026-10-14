<script lang="ts" generics="T extends AnyReaction">
  import type { AnyReaction } from "$lib/requests/models/AnyReaction.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toTranslatedReaction } from "$lib/utils/formatting/string/toTranslatedReaction.ts";
  import ReactionEmoji from "$lib/components/reactions/ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "./constants.ts";
  import type { ReactionDetailsProps } from "./ReactionDetailsProps.ts";

  const {
    reaction,
    value,
    isCurrent,
    index,
    onRemove,
    onAdd,
  }: ReactionDetailsProps<T> = $props();

  const label = $derived(toTranslatedReaction(reaction));

  const onPress = $derived(isCurrent ? onRemove : onAdd);
  const pressLabel = $derived(
    isCurrent
      ? m.button_label_remove_reaction({ reaction: label })
      : m.button_label_react({ reaction: label }),
  );
</script>

{#snippet content()}
  <ReactionEmoji
    code={REACTIONS_CODE_MAP[reaction]}
    {label}
    animation={isCurrent ? "infinite" : "none"}
    {index}
  />
  <p class="bold">{value}</p>
{/snippet}

{#if onPress}
  <button
    type="button"
    class="trakt-reaction-details is-pressable"
    class:is-current={isCurrent}
    aria-label={pressLabel}
    onclick={() => onPress(reaction)}
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

    min-width: var(--ni-64);

    --reaction-emoji-box: var(--ni-18);
    height: var(--ni-30);

    color: var(--color-foreground);
    cursor: default;

    box-sizing: border-box;
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);

    transition: background-color var(--transition-increment) ease-in-out;

    &.is-current {
      background-color: var(--color-current-reaction-background);
    }
  }

  .is-pressable {
    border: none;
    font: inherit;
    background-color: transparent;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

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
