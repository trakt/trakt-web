<script lang="ts">
  import ReactionPicker from "$lib/components/reactions/ReactionPicker.svelte";
  import ReactionsDistribution from "$lib/components/reactions/ReactionsDistribution.svelte";
  import { toReactionPickerOptions } from "$lib/components/reactions/toReactionPickerOptions.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePortal } from "$lib/features/portal/usePortal";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import type { ReactionsPopoverProps } from "./ReactionsPopoverProps.ts";

  /*
    Reacting to a title, the way reacting to a review already works: the
    trigger pops the same picker open over the same ranking of counts.
    Reacting is a one-tap answer to what you just watched, and anything that
    routes - a drawer, a page - makes it a trip away from the thing being
    reacted to.

    Persistent portal, so a click inside the panel does not dismiss it before
    the button under the pointer fires - the same mode the review picker uses.
  */
  const { chosen, onSelect, distribution, trigger }: ReactionsPopoverProps =
    $props();

  const { portalTrigger, portal, isOpened, close } = usePortal({
    placement: { position: "top" },
    type: "persistent",
  });

  const options = toReactionPickerOptions();

  /*
    One settle for the whole panel, rather than an entrance per emoji: this is
    a control the reader opened to use, not a performance. It barely scales -
    just enough to read as coming from the button it is anchored to - and
    decelerates into place.

    Checked here rather than in CSS because a Svelte transition runs in JS,
    where a media query cannot reach it. Reduced motion keeps the fade and
    drops the scale, so the panel still does not blink into existence.
  */
  const isReducedMotion = globalThis.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches ?? false;

  const settle = {
    start: isReducedMotion ? 1 : 0.96,
    opacity: 0,
    easing: cubicOut,
  };

  /*
    Closes on a pick, where the review picker stays open: that one is read
    while you work down a thread, and this is opened from a badge that prints
    the result anyway. Clearing a pick closes too.
  */
  function selectHandler(reaction: Reaction) {
    onSelect(reaction);
    close();
  }
</script>

<button
  type="button"
  class="trakt-reactions-popover-trigger"
  use:portalTrigger
  aria-label={m.button_label_popup_reactions()}
>
  {@render trigger()}
</button>

{#if $isOpened}
  <!--
    The container is the panel's own box - no reserved size. The portal
    measures this element to choose above vs. below and to nudge it back on
    screen, so a box that disagreed with the panel inside it put the picker
    somewhere the trigger was not.
  -->
  <div class="trakt-reactions-popover" use:portal>
    <div
      class="popover-panel"
      in:scale={{ ...settle, duration: isReducedMotion ? 90 : 140 }}
      out:scale={{ ...settle, duration: isReducedMotion ? 60 : 90 }}
    >
      <!--
        Ranked rather than canonical: the question a title's panel answers is
        which reactions it is best known for, and an answer to that has to
        lead with the most used.
      -->
      <ReactionsDistribution
        {distribution}
        currentReaction={chosen}
        isLoading={false}
        title={m.header_media_reactions()}
        order="ranked"
      />

      <ReactionPicker
        {options}
        {chosen}
        onSelect={(id) => selectHandler(id as Reaction)}
      />
    </div>
  </div>
{/if}

<style lang="scss">
  .trakt-reactions-popover-trigger {
    all: unset;

    display: inline-flex;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
      border-radius: var(--border-radius-xxl);
    }
  }

  .trakt-reactions-popover {
    /*
      Out of flow and definitely sized, both so the portal measures it right.
      It centres the popup on its trigger using this element's width, read
      while the element is still sitting where Svelte put it - inside the
      header's row. A content-sized flex item there gets shrunk by the row, so
      the centring was done against a width the panel never had, and the popup
      opened off to one side.
    */
    position: absolute;
    /* The width the review popup uses, so the two read as one panel seen from
       two places. */
    width: var(--ni-340);

    /* Clear of the trigger on whichever side the portal picks. */
    &:global([data-popup-position="top"]) {
      padding-block-end: var(--ni-8);
    }

    &:global([data-popup-position="bottom"]) {
      padding-block-start: var(--ni-8);
    }
  }

  .popover-panel {
    width: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-xxl);
    box-shadow: var(--shadow-menu);
  }

  /*
    The picker is a bare row; whatever opens it sets the room around it, and
    these are the measurements the comment bar uses.

    Centred, which the comment bar is not: there the row opens with a close
    button, so its left edge is a real edge and the reactions read as starting
    after it. Here the row is the whole width of a panel with a ranked grid
    above it, and left-aligned it hung off one side of everything it belongs
    to.
  */
  .popover-panel :global(.trakt-reaction-picker) {
    height: var(--ni-40);
    margin: var(--ni-8);

    justify-content: center;
  }

  /* Grows out of the edge nearest its trigger. `--alignment-correction` is how
     far the portal shoved the box to keep it on screen; subtracting it keeps
     the origin over the trigger rather than over the panel's own centre. */
  .trakt-reactions-popover:global([data-popup-position="top"]) .popover-panel {
    transform-origin: calc(50% - var(--alignment-correction, 0px)) bottom;
  }

  .trakt-reactions-popover:global([data-popup-position="bottom"])
    .popover-panel {
    transform-origin: calc(50% - var(--alignment-correction, 0px)) top;
  }
</style>
