<script lang="ts">
  import { type Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type RatingItemProps = {
    rating?: string | number | Nil;
    superscript: Snippet;
    url?: string | Nil;
    isLoading?: boolean;
    // "minimal" drops the vote-count superscript, showing the score alone;
    // "default" renders it. The compact summary row is minimal, the ratings
    // drawer is default.
    style?: "default" | "minimal";
    // "row" (default) is the compact inline logo → value → votes layout.
    // "tile" stacks a large logo above the value and sublabel inside a
    // full-height clickable card, used by the ratings drawer grid.
    layout?: "row" | "tile";
  } & ChildrenProps;

  const {
    children,
    rating,
    superscript,
    url,
    isLoading = false,
    style = "default",
    layout = "row",
  }: RatingItemProps = $props();

  const hasValidRating = $derived(rating !== undefined);
  const ratingLink = $derived(hasValidRating ? url : undefined);
</script>

<rating data-layout={layout}>
  <Link href={ratingLink} target="_blank">
    <div
      class="rating-item"
      data-layout={layout}
      class:has-valid-rating={hasValidRating}
    >
      {@render children()}
      <div class="rating-info">
        <div class="rating-value">
          {#if isLoading}
            <span class="rating-skeleton" aria-hidden="true"></span>
          {:else if hasValidRating}
            <p class="bold">{rating}</p>
          {:else}
            <p class="bold">-</p>
          {/if}
        </div>
        {#if style === "default"}
          <div class="rating-votes">
            {#if isLoading}
              <span
                class="rating-skeleton rating-skeleton-votes"
                aria-hidden="true"
              ></span>
            {:else if hasValidRating}
              <p class="bold secondary vote-count tag">
                {@render superscript()}
              </p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </Link>
</rating>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  rating[data-layout="tile"] {
    display: block;
    height: 100%;

    :global(.trakt-link),
    :global(.trakt-no-link) {
      display: block;
      height: 100%;
    }

    :global(.vote-count)::after {
      display: none;
    }

    :global(.vote-count) {
      color: var(--color-text-secondary);
    }
  }

  rating {
    :global(.trakt-link) {
      text-decoration: none;

      :global(.vote-count) {
        position: relative;

        &::after {
          content: "";
          position: absolute;

          bottom: var(--ni-neg-4);
          inset-inline-start: 0;

          width: 100%;

          height: var(--ni-2);
          background-color: var(--color-link-active);
        }
      }

      &:hover {
        :global(svg) {
          transform: scale(1.1);
        }
      }
    }
  }

  .rating-item {
    display: flex;

    align-items: center;
    gap: var(--gap-xxs);

    p {
      transition: font-size calc(var(--transition-increment) * 2) ease-in-out;
    }

    :global(svg) {
      height: var(--font-size-text);
      width: auto;

      transition: calc(var(--transition-increment) * 2) ease-in-out;

      transition-property: width, height, transform, filter;
      filter: grayscale(1);
    }

    &.has-valid-rating {
      :global(svg) {
        filter: grayscale(0);
      }
    }

    &[data-layout="tile"] {
      flex-direction: column;
      justify-content: center;
      gap: var(--gap-s);

      height: 100%;
      box-sizing: border-box;
      padding: var(--ni-16) var(--ni-12);

      background: var(--color-card-background);
      border-radius: var(--border-radius-m);
      text-align: center;

      // Direct-child only: the source logo. Scoped so nested glyphs (e.g. the
      // vote-count person icon) keep their own smaller size.
      > :global(svg) {
        height: var(--ni-28);
      }
    }
  }

  .rating-info {
    display: flex;
    align-items: start;
    gap: var(--gap-xxs);

    p {
      line-height: 90%;
    }

    [data-layout="tile"] & {
      flex-direction: column;
      align-items: center;
      gap: var(--gap-xs);

      .rating-value,
      .rating-votes {
        justify-content: center;
      }

      .rating-value :global(p) {
        font-size: var(--ni-20);
      }

      :global(.vote-count) {
        display: inline-flex;
        align-items: center;
        gap: var(--gap-xxs);

        // ::first-letter (the .capitalize utility) doesn't apply to this
        // inline-flex box, so capitalize the enum labels (fresh/hot/…) here.
        text-transform: capitalize;

        :global(svg) {
          height: var(--font-size-tag);
          width: auto;
          filter: none;
        }
      }
    }

    // Value and vote-count slots reserve a fixed width so the skeleton and the
    // loaded content occupy the same space: content swaps in place, no slide,
    // no jump. tabular-nums keeps digit changes (e.g. re-rating) from shifting.
    .rating-value,
    .rating-votes {
      display: flex;
      align-items: center;

      min-height: var(--font-size-text);

      font-variant-numeric: tabular-nums;
    }

    // fits the common 3-char score ("87%", "8.6") snug; the rare 4-char score
    // ("100%", "10.0") grows a hair, which is imperceptible and unusual.
    .rating-value {
      min-width: 3ch;
    }

    // fits the widest vote-count ("359.7K"); the drawer is the only place these
    // render, so reserving here keeps the row from growing once votes land.
    .rating-votes {
      min-width: 6ch;
    }

    .rating-skeleton {
      display: block;

      width: 3ch;
      height: var(--font-size-text);

      border-radius: var(--border-radius-xs);
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 20%,
        transparent
      );

      animation: pulse calc(var(--transition-increment) * 6) ease-in-out
        infinite alternate;
    }

    .rating-skeleton-votes {
      width: 6ch;
    }
  }
</style>
