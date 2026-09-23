<script lang="ts">
  import { usePortal } from "$lib/features/portal/usePortal";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import { recentReactionsStore } from "../stores/recentReactionsStore.ts";
  import ReactionPicker from "$lib/components/reactions/ReactionPicker.svelte";
  import { reactionSentimentDefinitions } from "../reactionSentimentDefinitions.ts";
  import type { ReactionsPopoverProps } from "./ReactionsPopoverProps.ts";

  /*
    Reacting to a title, the way reacting to a review already works: the
    trigger pops the picker open in place. Reacting is a one-tap answer to
    what you just watched, and anything that routes - a drawer, a page - makes
    it a trip away from the thing being reacted to.

    Persistent portal, so a click inside the picker does not dismiss it before
    the button under the pointer fires - the same mode the review picker uses.
  */
  const { chosen, onSelect, trigger }: ReactionsPopoverProps = $props();

  const { portalTrigger, portal, isOpened, close } = usePortal({
    placement: { position: "top" },
    type: "persistent",
  });

  const recent = recentReactionsStore.recent;

  /* The media taxonomy, flattened for the shared picker - the same control the
     review reactions use, split into a quick row plus search because nine
     sentiments do not fit a pill the way seven fit a comment bar. */
  const QUICK_COUNT = 6;

  const options = Object.entries(reactionSentimentDefinitions).map((
    [sentiment, definition],
  ) => ({
    id: sentiment,
    label: definition.label(),
    code: definition.code,
  }));

  /*
    One settle for the whole panel, rather than an entrance per emoji: nine
    things bumping in one after another is a performance, and this is a
    control the reader opened to use. It barely scales - just enough to read
    as coming from the button it is anchored to - and decelerates into place.

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
    Closes on a pick, where the review picker stays open: it holds a
    distribution worth watching update, and this holds nine sentiments the
    viewer has just answered. Clearing a pick closes too - the trigger shows
    the result either way.
  */
  function selectHandler(sentiment: ReactionSentiment) {
    if (sentiment !== chosen) {
      recentReactionsStore.remember(sentiment);
    }

    onSelect(sentiment);
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
      <ReactionPicker
        {options}
        {chosen}
        quickCount={QUICK_COUNT}
        preferred={$recent}
        onSelect={(id) => selectHandler(id as ReactionSentiment)}
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
      header's action row. A content-sized flex item there gets shrunk by the
      row, so the centring was done against a width the panel never had, and
      the popup opened off to one side.
    */
    position: absolute;
    /*
      Sized to the WIDEST mode the picker has - the quick tray, which is six
      targets, a rule and the toggle. The search field then fills the same
      box. Too narrow and the content hangs off the painted panel, which is
      what 280 did once the tray gained its toggle.
    */
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

    background-color: var(--color-reaction-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-menu);
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
