<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import type { MediaReactionsBadgeProps } from "./MediaReactionsBadgeProps.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import SentimentEmoji from "./_internal/SentimentEmoji.svelte";
  import ReactionsPopover from "./_internal/ReactionsPopover.svelte";
  import { toTopSentiments } from "./toTopSentiments.ts";
  import { useMediaReactions } from "./stores/useMediaReactions.ts";

  /*
    One pill, two zones split by a hairline.

    The viewer's own slot LEADS - an invite to react, or their pick held in a
    ring - and the room follows it: the top sentiments and the total, which
    never change shape because of the viewer.

    That split is the whole point. Letting the glyphs speak for everyone
    including the viewer reads as one statement in two voices; separating them
    means the stack stays an honest reading of the room while the viewer's
    answer sits somewhere it cannot be mistaken for it. Their pick stays in
    its own slot even when it matches one of the top glyphs - no exceptions,
    or the slot stops being a place you can look.
  */
  const { type, slug }: MediaReactionsBadgeProps = $props();

  const summary = $derived(useMediaReactions({ type, slug }).summary);

  let chosen = $state<ReactionSentiment | null>(null);

  const glyphs = $derived(toTopSentiments(summary.metrics));

  /* The room only speaks once somebody has: no glyphs and no count means
     there is nothing following the viewer's slot to divide it from. */
  const hasRoom = $derived(glyphs.length > 0 || summary.totalCount > 0);
</script>

<ReactionsPopover
  {chosen}
  onSelect={(sentiment) => (chosen = chosen === sentiment ? null : sentiment)}
>
  {#snippet trigger()}
    <span class="trakt-media-reactions-badge">
      <span class="badge-mine" class:has-reaction={chosen != null}>
        {#if chosen}
          <SentimentEmoji sentiment={chosen} />
        {:else}
          <ReactionIcon state="add" />
        {/if}
      </span>

      {#if hasRoom}
        <!-- Only earns its place between two things. With no reactions yet
             the pill is the invite alone, and a rule beside nothing reads as
             a control that failed to load. -->
        <span
          class="badge-hairline"
          class:has-icon-before={chosen == null}
          aria-hidden="true"
        ></span>

        <span class="badge-room">
          <span class="badge-glyphs" aria-hidden="true">
            {#each glyphs as sentiment, index (sentiment)}
              <span class="badge-glyph" style:z-index={glyphs.length - index}>
                <SentimentEmoji {sentiment} />
              </span>
            {/each}
          </span>

          {#if summary.totalCount > 0}
            <span class="badge-count bold">
              {toHumanNumber(summary.totalCount, getLocale())}
            </span>
          {/if}
        </span>
      {/if}
    </span>
  {/snippet}
</ReactionsPopover>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-media-reactions-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    /* Matches the social pill it sits beside, so one hover shape runs across
       the whole row rather than a taller box here and a shorter one there. */
    min-height: var(--ni-36);
    box-sizing: border-box;
    padding: var(--ni-4) var(--ni-12);

    border-radius: var(--border-radius-xxl);

    /*
      Bare at rest, lit on hover - the same way every other control in the
      action row behaves. A standing fill made this the one element in the
      row wearing a surface all the time, which read as a selected state
      rather than a button, and the hairline is enough to keep the two zones
      apart without one.
    */
    background: none;

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      :global(.trakt-reactions-popover-trigger:hover) & {
        background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
      }
    }

    /* Held lit while the tray is open, so the pill still reads as the thing
       the panel belongs to once the pointer has moved into it. */
    :global(.trakt-reactions-popover-trigger[aria-expanded="true"]) & {
      background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    }

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .badge-room {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .badge-glyphs {
    display: inline-flex;
    align-items: center;

    --reaction-emoji-size: var(--ni-16);
  }

  /*
    Overlapped like the review cluster - a stack, not a queue. Each glyph
    carries a ring in the surface BEHIND the pill rather than the pill's own
    fill: the cut has to read against the page, which is what makes the
    overlap look like discs in front of each other instead of a smear.
  */
  .badge-glyph {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    box-sizing: content-box;
    border-radius: 50%;
    box-shadow: 0 0 0 var(--border-thickness-xs) var(--color-background);
  }

  .badge-glyph + .badge-glyph {
    margin-inline-start: calc(-1 * var(--ni-5));
  }

  .badge-count {
    font-size: var(--font-size-text-small);
    color: var(--color-text-primary);
  }

  .badge-hairline {
    width: var(--border-thickness-xxs);
    height: var(--ni-20);

    background: var(--color-border);
  }

  /*
    Optical, not geometric. The flex gap is already equal on both sides, but
    what sits either side is not: the count's digits end where their ink ends,
    while the invite icon is drawn 2.5px inside its own box - so the rule read
    as sitting closer to the number than to the smiley. This pays that bearing
    back on the side the glyphs are on.

    Only against the ICON. The reacted slot is a filled ring whose ink reaches
    its edge, so it needs no compensation and would look over-spaced with it.
  */
  .badge-hairline.has-icon-before {
    margin-inline-end: var(--ni-2);
  }

  .badge-mine {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    --reaction-emoji-size: var(--ni-16);

    color: var(--color-text-secondary);
  }

  /*
    The viewer's own pick, ringed so it cannot be read as one more of the
    room's glyphs. The ring is the accent rather than a fill, so the emoji
    keeps its own colour.
  */
  .badge-mine.has-reaction {
    box-sizing: border-box;
    width: var(--ni-28);
    height: var(--ni-28);

    border-radius: 50%;
    background: color-mix(in srgb, var(--purple-500) 22%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
  }
</style>
