<script lang="ts">
  import { type Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type RatingItemProps = {
    rating?: string | number | Nil;
    superscript: Snippet;
    url?: string | Nil;
    isLoading?: boolean;
  } & ChildrenProps;

  const {
    children,
    rating,
    superscript,
    url,
    isLoading = false,
  }: RatingItemProps = $props();

  const hasValidRating = $derived(rating !== undefined);
  const ratingLink = $derived(hasValidRating ? url : undefined);
</script>

<rating>
  <Link href={ratingLink} target="_blank">
    <div class="rating-item" class:has-valid-rating={hasValidRating}>
      {@render children()}
      <div class="rating-info">
        <div class="rating-value">
          {#if isLoading}
            <span class="rating-skeleton" aria-hidden="true"></span>
          {:else if hasValidRating}
            <span class="rating-grow">
              <span class="rating-grow-clip">
                <p class="bold">{rating}</p>
              </span>
            </span>
          {:else}
            <p class="bold">-</p>
          {/if}
        </div>
        {#if !isLoading && hasValidRating}
          <span class="rating-grow has-underline">
            <span class="rating-grow-clip">
              <p class="bold uppercase secondary vote-count tag">
                {@render superscript()}
              </p>
            </span>
          </span>
        {/if}
      </div>
    </div>
  </Link>
</rating>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes rating-grow-in {
    from {
      grid-template-columns: 0fr;
      opacity: 0;
    }

    to {
      grid-template-columns: 1fr;
      opacity: 1;
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
          transform: scale(1.15);
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
  }

  .rating-info {
    display: flex;
    align-items: start;
    gap: var(--gap-xxs);

    p {
      line-height: 90%;
    }

    .rating-value {
      display: flex;
      align-items: center;

      min-height: var(--font-size-text);

      // tabular-nums keeps digit changes (e.g. re-rating) from micro-shifting.
      font-variant-numeric: tabular-nums;

      // Small screens hide the vote-count and don't animate, so reserve the
      // full value width up front (skeleton == loaded value) - no load jump.
      // "100%" is the widest value; with tabular-nums each digit is 1ch.
      min-width: 4ch;

      @include for-desktop {
        // desktop animates the grow-in instead of reserving space
        min-width: 0;
      }
    }

    // CSS-only width grow-in. The 0fr -> 1fr column animation reflows for real
    // (siblings glide, no jump). Gated to desktop: small screens hide the
    // vote-count, so there is little to grow and the motion reads as jitter.
    .rating-grow {
      display: inline-grid;
      grid-template-columns: 1fr;

      @include for-desktop {
        animation: rating-grow-in var(--transition-increment) ease-in-out;
      }
    }

    .rating-grow-clip {
      min-width: 0;

      // clip the horizontal collapse; margin gives glyphs vertical breathing
      overflow: clip;
      overflow-clip-margin: var(--ni-2);
    }

    // extra clip margin keeps the vote-count underline visible
    .rating-grow.has-underline .rating-grow-clip {
      overflow-clip-margin: var(--ni-6);
    }

    .rating-skeleton {
      display: block;

      // match the reserved value box on small screens; slimmer bar on desktop
      width: 4ch;
      height: var(--font-size-text);

      @include for-desktop {
        width: var(--ni-24);
      }

      border-radius: var(--border-radius-xs);
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 20%,
        transparent
      );

      animation: pulse calc(var(--transition-increment) * 6) ease-in-out
        infinite alternate;
    }
  }
</style>
