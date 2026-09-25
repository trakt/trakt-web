<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { TrendingEntry } from "$lib/sections/lists/trending/useTrendingList.ts";

  const {
    items,
    active,
  }: { items: ReadonlyArray<TrendingEntry>; active: number } = $props();
</script>

<div class="trakt-landing-backdrop" aria-hidden="true">
  {#each items as item, index (item.key)}
    <div class="backdrop-wash" class:is-active={index === active}>
      <CrossOriginImage src={item.poster.url.thumb} alt="" animate={false} />
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing-backdrop {
    position: absolute;
    inset: calc(-1 * var(--ni-80));

    pointer-events: none;

    &::after {
      content: "";
      position: absolute;
      inset: 0;

      background:
        linear-gradient(
          calc(90deg * var(--rtl-sign)),
          color-mix(in srgb, var(--shade-940) 94%, transparent) 0%,
          color-mix(in srgb, var(--shade-940) 60%, transparent) 50%,
          color-mix(in srgb, var(--shade-940) 25%, transparent) 100%
        ),
        linear-gradient(to top, var(--shade-940) 0%, transparent 30%);
    }

    @include for-tablet-sm-and-below {
      &::after {
        background: linear-gradient(
          to top,
          var(--shade-940) 0%,
          color-mix(in srgb, var(--shade-940) 60%, transparent) 55%,
          color-mix(in srgb, var(--shade-940) 30%, transparent) 100%
        );
      }
    }
  }

  .backdrop-wash {
    position: absolute;
    inset: 0;

    opacity: 0;
    transition: opacity 1.2s ease;

    &.is-active {
      opacity: 0.6;
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;

      filter: blur(var(--ni-80)) saturate(1.5);
      transform: scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop-wash {
      transition: none;
    }
  }
</style>
