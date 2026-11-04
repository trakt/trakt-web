<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import RateNow from "./RateNow.svelte";
  import type { RatingBadgeProps } from "./models/RatingBadgeProps.ts";
  import { useIsRateable } from "./useIsRateable.ts";
  import { useRatings } from "./useRatings.ts";

  /*
    Rating as a single mark rather than a row of stars: an empty star until
    you have rated, your score and one star after. The stars themselves live
    in a popover that opens above the mark - the history list's treatment,
    shared so a title reads the same wherever it is rated.

    Why a mark and not the row: five stars sitting in a header read as five
    controls competing with the actions beside them, and they state a score
    the reader has to count. "8 ★" says it in two glyphs.
  */
  const {
    target,
    variant = "allow",
    favorite = false,
    look = "mark",
  }: RatingBadgeProps = $props();

  const { isRateable } = $derived(useIsRateable(target));
  const isLocked = $derived(variant === "guard" && !$isRateable);


  const title = $derived(
    "title" in target.media ? target.media.title ?? undefined : undefined,
  );

  /* The same source RateNow reads, so the mark and the stars inside the
     popover can never disagree - including while a rating is in flight. */
  const { current, pendingRating } = $derived(
    useRatings({ type: target.type, id: target.media.id, title }),
  );

  const rating = $derived($pendingRating ?? $current?.rating);
  const state = $derived(
    rating ? "rated" : $isRateable ? "invite" : "unseen",
  );

  const label = $derived.by(() => {
    const named = title ?? "";
    return rating
      ? m.button_label_change_rating({ title: named })
      : m.button_label_rate({ title: named });
  });
</script>

{#snippet rateContent()}
  <div class="rating-badge-popover">
    <RateNow {...target} variant="allow" showFavorite={!favorite} />
  </div>
{/snippet}

<!--
  Rated and unrated share one trigger, so a rating landing while the popover
  is open swaps the mark in place instead of unmounting the popover under the
  pointer - the history list learned this the hard way.
-->
{#if isLocked}
  <!--
    The same two marks, inert: an empty star and an empty heart. ActionButton
    carries the explanation as its label, which is both the accessible name
    and the hover tooltip - the house treatment for a control that is present
    but not yet usable.
  -->
  <div class="trakt-rating-badge-cluster">
    <ActionButton
      label={m.tooltip_rate_requires_watch()}
      style="ghost"
      disabled
    >
      <StarIcon fill="none" />
    </ActionButton>

    {#if favorite && target.type !== "episode" && target.type !== "season"}
      <ActionButton
        label={m.tooltip_rate_requires_watch()}
        style="ghost"
        disabled
      >
        <FavoriteIcon state="open" --icon-color="var(--color-background-red)" />
      </ActionButton>
    {/if}
  </div>
{:else}
  <div class="trakt-rating-badge-cluster">
    <Popover content={rateContent} {label}>
      <span
        class="trakt-rating-badge"
        class:is-rated={Boolean(rating)}
        data-look={look}
        data-state={state}
      >
        {#if rating}
          <UserRating {rating} />
        {:else}
          <StarIcon fill="none" />
        {/if}
        {#if look === "chip" && state === "invite"}
          <span class="rating-badge-dot" aria-hidden="true"></span>
        {/if}
      </span>
    </Popover>

    <!-- Inline rather than a derived flag: the check is what narrows the
         target to something with a favouritable type. -->
    {#if favorite && target.type !== "episode" && target.type !== "season"}
      <FavoriteAction
        style="action"
        title={target.media.title}
        type={target.type}
        id={target.media.id}
      />
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /* Score then heart - the answer, then the keepsake. */
  .trakt-rating-badge-cluster {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .trakt-rating-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: var(--color-foreground);

    /*
      The hover surface matches whatever sits beside it. Left to its content
      the mark painted a shorter box than the heart's button next to it, and
      two different hover shapes in one row read as two different kinds of
      control. A caller that puts it among action buttons sets the box to
      theirs; on its own it stays content-sized, as the history list wants.
    */
    min-height: var(--rating-badge-box, auto);
    min-width: var(--rating-badge-box, auto);
    box-sizing: border-box;

    /* Padding traded against margin so the press surface exists without the
       mark moving the row it sits in. */
    padding: var(--ni-8);
    margin: var(--rating-badge-inset, calc(-1 * var(--ni-8)));
    border-radius: var(--border-radius-m);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, transform;

    /*
      Unrated shows a lone star, sized here rather than by UserRating. Guarded
      on :not(.is-rated) so it can never reach the rated mark's own icon.
    */
    &:not(.is-rated) :global(svg) {
      width: var(--rating-badge-size, var(--ni-20));
      height: var(--rating-badge-size, var(--ni-20));
    }

    @include for-mouse() {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }

    &:active {
      transform: scale(0.92);
    }
  }

  /*
    The viewer's own score, kept clean: no frame at rest, a grey pill of
    wash on hover so the press surface shows where it is. Watched but
    unrated, a small dot invites a rating; not watched, the star stays
    quiet - still a way in, since any title can be rated.
  */
  .trakt-rating-badge[data-look="chip"] {
    position: relative;

    min-width: var(--ni-44);
    min-height: var(--ni-36);
    padding: 0;
    margin: 0;
    border-radius: 999px;

    &:not(.is-rated) :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &[data-state="rated"] {
      padding-inline: var(--ni-12);

      :global(.trakt-user-rating span) {
        font-weight: 700;
      }

      :global(.trakt-user-rating svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }

    &[data-state="unseen"] {
      color: var(--color-text-quiet);
    }

    @include for-mouse() {
      &:hover {
        color: var(--color-text-primary);
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }
  }

  .rating-badge-dot {
    position: absolute;
    inset-block-start: var(--ni-8);
    inset-inline-end: var(--ni-8);

    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: var(--border-radius-pill);

    background-color: var(--purple-300);
    box-shadow: 0 0 0 var(--ni-2)
      var(--rating-badge-dot-ring, var(--color-actions-bar-background));
  }

  .rating-badge-popover {
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-l);
    background-color: var(--color-modal-background);
    box-shadow: var(--shadow-menu);
  }
</style>
