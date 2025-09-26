<script lang="ts" generics="T extends { id: unknown }">
  import { type Snippet } from "svelte";
  import { fade, slide } from "svelte/transition";
  import Link from "../link/Link.svelte";

  type RatingItemProps = {
    rating?: string | number | Nil;
    superscript: Snippet;
    url?: string | Nil;
  } & ChildrenProps;

  const { children, rating, superscript, url }: RatingItemProps = $props();

  const hasValidRating = $derived(rating !== undefined);
  const ratingLink = $derived(hasValidRating ? url : undefined);
</script>

<rating>
  <Link href={ratingLink} target="_blank">
    <div class="rating-item" class:has-valid-rating={hasValidRating}>
      {@render children()}
      <div class="rating-info">
        <div class="rating-value">
          {#if !hasValidRating}
            <p class="large bold" out:slide={{ duration: 150, axis: "x" }}>-</p>
          {:else}
            <div in:fade={{ delay: 150, duration: 150 }}>
              <p class="large bold" in:slide={{ duration: 150, axis: "x" }}>
                {rating}
              </p>
            </div>
          {/if}
        </div>
        {#if hasValidRating}
          <p class="small bold uppercase secondary vote-count">
            {@render superscript()}
          </p>
        {/if}
      </div>
    </div>
  </Link>
</rating>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  rating {
    :global(.trakt-link) {
      text-decoration: none;

      :global(.vote-count) {
        position: relative;

        &::after {
          content: "";
          position: absolute;

          bottom: var(--ni-neg-4);
          left: 0;

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
      transition: calc(var(--transition-increment) * 2) ease-in-out;

      transition-property: width, height, transform, filter;
      filter: grayscale(1);
    }

    &.has-valid-rating {
      :global(svg) {
        filter: grayscale(0);
      }
    }

    @include for-mobile {
      :global(svg) {
        height: var(--ni-12);
        width: auto;
      }

      p.large {
        font-size: var(--ni-12);
      }

      p.small {
        font-size: var(--ni-10);
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
      position: relative;
      min-width: var(--ni-6);

      :global(p[inert]) {
        position: absolute;
      }
    }
  }
</style>
