<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { reactionSentimentDefinitions } from "../reactionSentimentDefinitions.ts";
  import type { ReactionsCtaProps } from "./ReactionsCtaProps.ts";
  import ReactionGlyph from "./ReactionGlyph.svelte";

  const { topSentiments, chosen, onclick }: ReactionsCtaProps = $props();

  const chosenDefinition = $derived(
    chosen != null ? reactionSentimentDefinitions[chosen] : null,
  );

  const label = $derived(
    chosenDefinition != null
      ? chosenDefinition.label()
      : m.reactions_cta_label(),
  );

  const ariaLabel = $derived(
    chosenDefinition != null
      ? m.reactions_cta_chosen_label({ sentiment: chosenDefinition.label() })
      : m.reactions_cta_label(),
  );
</script>

<button
  type="button"
  class="trakt-reactions-cta"
  class:is-chosen={chosen != null}
  aria-label={ariaLabel}
  {onclick}
>
  <span class="cta-glyphs">
    {#if chosen != null}
      <span class="cta-glyph-badge"><ReactionGlyph sentiment={chosen} /></span>
    {:else}
      {#each topSentiments as sentiment, index (sentiment)}
        <span
          class="cta-glyph-badge"
          style:z-index={topSentiments.length - index}
        >
          <ReactionGlyph {sentiment} />
        </span>
      {/each}
    {/if}
  </span>

  <span class="cta-label bold">{label}</span>

  <span class="cta-chevron" aria-hidden="true"><CaretRightIcon /></span>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reactions-cta {
    // Opaque so overlapping emoji badges can carve a clean gap against it
    // (used as the badge ring colour) rather than needing a grey stroke.
    --cta-bg: color-mix(
      in srgb,
      var(--purple-500) 12%,
      var(--color-page-background)
    );

    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);

    // Match the friends-activity avatar pill's height and shape.
    height: var(--ni-36);
    box-sizing: border-box;
    padding-inline: var(--ni-8);

    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 32%, transparent);
    border-radius: var(--border-radius-xxl);
    background: var(--cta-bg);
    color: var(--color-text-primary);

    cursor: pointer;
    white-space: nowrap;

    transition:
      transform var(--transition-increment) ease-out,
      background var(--transition-increment) ease-in-out,
      border-color var(--transition-increment) ease-in-out;

    // Loved hover colour swap - kept.
    @include for-mouse {
      &:hover {
        --cta-bg: color-mix(
          in srgb,
          var(--purple-500) 20%,
          var(--color-page-background)
        );
        background: color-mix(
          in srgb,
          var(--purple-500) 20%,
          var(--color-page-background)
        );
        border-color: color-mix(in srgb, var(--purple-500) 55%, transparent);
      }
    }

    &:active {
      transform: scale(0.97);
    }

    .cta-glyphs {
      display: inline-flex;
      align-items: center;
    }

    .cta-glyph-badge {
      // Large emoji that nearly fill the badge, minimising the dark edge.
      --reaction-glyph-size: var(--ni-24);

      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: var(--ni-28);
      height: var(--ni-28);
      box-sizing: border-box;
      border-radius: 50%;

      // Opaque dark disc; the ring is the button's own colour, so overlapping
      // badges separate with a clean gap instead of a grey stroke.
      background: var(--color-card-background);
      box-shadow: 0 0 0 var(--ni-2) var(--cta-bg);

      margin-inline-start: calc(-1 * var(--ni-10));

      &:first-child {
        margin-inline-start: 0;
      }
    }

    .cta-label {
      flex: 1;
      text-align: center;
      font-size: var(--font-size-text);
    }

    // Replicate the avatar pill's caret: dim by default, brighten and nudge
    // along the reading direction on hover.
    .cta-chevron {
      display: inline-flex;
      align-items: center;
      opacity: 0.55;

      transition:
        transform var(--transition-increment) ease-out,
        opacity var(--transition-increment) ease-out;

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }

    &:hover .cta-chevron {
      opacity: 0.9;
      transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
    }
  }
</style>
