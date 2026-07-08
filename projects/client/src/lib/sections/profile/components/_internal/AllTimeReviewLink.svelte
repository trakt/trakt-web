<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { AllTimeReviewLinkProps } from "./AllTimeReviewLinkProps.ts";

  const { href, label, text, icon, onclick }: AllTimeReviewLinkProps = $props();
</script>

<div class="trakt-all-time-review-link">
  <Link {href} {label} {onclick} color="inherit">
    <span class="review-link-badge">
      {@render icon()}
    </span>

    <p class="review-link-text bold capitalize ellipsis">{text}</p>

    <span class="review-link-caret" aria-hidden="true">
      <CaretRightIcon />
    </span>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-all-time-review-link {
    :global(.trakt-link[data-color="inherit"]) {
      @include card-tile-surface;

      display: flex;
      align-items: center;
      gap: var(--gap-s);

      text-decoration: none;

      transition-property: transform, box-shadow;
      transition-duration: var(--transition-increment);
      transition-timing-function: ease-in-out;
    }

    :global(.trakt-link[data-color="inherit"]:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-text-primary);
      outline-offset: var(--ni-2);
    }
  }

  .review-link-badge {
    flex: 0 0 auto;

    display: grid;
    place-items: center;

    width: var(--ni-32);
    height: var(--ni-32);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .review-link-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
  }

  .review-link-caret {
    flex: 0 0 auto;

    display: grid;
    place-items: center;

    color: var(--color-text-secondary);

    transition: transform var(--transition-increment) ease-in-out;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  @include for-mouse {
    .trakt-all-time-review-link:hover {
      :global(.trakt-link[data-color="inherit"]) {
        box-shadow: var(--shadow-raised);
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .trakt-all-time-review-link:hover {
        :global(.trakt-link[data-color="inherit"]) {
          transform: translateY(calc(-1 * var(--ni-2)));
        }

        .review-link-caret {
          transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
        }
      }
    }
  }
</style>
