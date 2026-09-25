<script lang="ts">
  import ReactionIcon from "$lib/components/icons/ReactionIcon.svelte";
  import ReactionEmoji from "$lib/components/reactions/ReactionEmoji.svelte";
  import { REACTIONS_CODE_MAP } from "$lib/components/reactions/reactionCodeMap.ts";
  import { getLocale } from "$lib/features/i18n";
  import type { Reaction } from "$lib/requests/queries/comments/commentReactionsQuery";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { toTranslatedReaction } from "$lib/utils/formatting/string/toTranslatedReaction";
  import type { MediaReactionsBadgeProps } from "./MediaReactionsBadgeProps.ts";
  import ReactionsPopover from "./_internal/ReactionsPopover.svelte";
  import { useMediaReactions } from "./stores/useMediaReactions.ts";

  /*
    One pill, two zones split by a hairline.

    The viewer's own slot LEADS - an invite to react, or their pick held in a
    ring - and the room follows it: the top reactions and the total, which
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

  let chosen = $state<Reaction | null>(null);

  const glyphs = $derived(summary.top);

  /* The room only speaks once somebody has: no glyphs and no count means
     there is nothing following the viewer's slot to divide it from. */
  const hasRoom = $derived(glyphs.length > 0 || summary.totalCount > 0);
</script>

<ReactionsPopover
  {chosen}
  distribution={summary.distribution}
  onSelect={(reaction) => (chosen = chosen === reaction ? null : reaction)}
>
  {#snippet trigger()}
    <span class="trakt-media-reactions-badge">
      <span class="badge-mine" class:has-reaction={chosen != null}>
        {#if chosen}
          <ReactionEmoji
            code={REACTIONS_CODE_MAP[chosen]}
            label={toTranslatedReaction(chosen)}
          />
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
            {#each glyphs as reaction (reaction)}
              <ReactionEmoji
                code={REACTIONS_CODE_MAP[reaction]}
                label={toTranslatedReaction(reaction)}
              />
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

  /*
    A queue, not a stack - exactly what the review cluster does.

    These were overlapped, each glyph carrying a ring to cut it out of the one
    behind it. A ring can only do that in the colour of whatever is actually
    painted behind it, and this pill is transparent at rest over a header that
    is artwork, gradient and page in turn. So the ring was never the backdrop:
    it was a dark circle drawn around every emoji.

    The renderer's own box already holds them apart, so nothing has to be
    drawn at all.
  */
  .badge-glyphs {
    display: inline-flex;
    align-items: center;
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

    /* Same reason as the stack beside it. */
    --reaction-emoji-box: var(--ni-18);

    /*
      The same weight the invite carries on a review, where the react button
      unsets itself and inherits body text. Secondary greyed it down a step,
      which read as disabled next to glyphs at full strength - and it is the
      one thing in the pill the viewer is meant to press.
    */
    color: var(--color-text-primary);
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
