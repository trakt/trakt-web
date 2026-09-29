<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  const { rating }: { rating: number } = $props();
</script>

<span
  class="trakt-yir-stars"
  style:--fill="{rating * 10}%"
  role="img"
  aria-label={m.yir_2026_top_rated_rating({ rating })}
>
  <span aria-hidden="true">★★★★★</span>
  <span class="yir-stars-fill" aria-hidden="true">★★★★★</span>
</span>

<style>
  .trakt-yir-stars {
    position: relative;
    display: inline-block;
    letter-spacing: 0.08em;
    color: var(--color-yir-separator);
    white-space: nowrap;
  }

  .yir-stars-fill {
    position: absolute;
    inset: 0;
    color: var(--color-yir-accent);
    clip-path: inset(0 calc(100% - var(--fill)) 0 0);
  }

  .yir-stars-fill {
    clip-path: inset(0 100% 0 0);
    transition: clip-path calc(var(--yir-beat) * 11) var(--yir-ease);
    transition-delay: calc(var(--d, 0ms) + var(--yir-beat) * 4);
  }

  :global(.is-in) .yir-stars-fill {
    clip-path: inset(0 calc(100% - var(--fill)) 0 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-stars-fill {
      clip-path: inset(0 calc(100% - var(--fill)) 0 0);
      transition: none;
    }
  }
</style>
