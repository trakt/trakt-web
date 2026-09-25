<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { TrendingEntry } from "$lib/sections/lists/trending/useTrendingList.ts";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType.ts";
  import { spotlightPosition } from "../spotlightPosition.ts";

  const {
    items,
    active,
  }: { items: ReadonlyArray<TrendingEntry>; active: number } = $props();

  const current = $derived(items.at(active));
</script>

<div class="trakt-landing-spotlight">
  <div class="spotlight-cards" aria-hidden="true">
    {#each items as item, index (item.key)}
      <div
        class="spotlight-card"
        data-position={spotlightPosition({
          index,
          active,
          count: items.length,
        })}
      >
        <CrossOriginImage
          src={item.poster.url.medium}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
    {/each}
  </div>

  {#if current}
    <div class="spotlight-caption">
      <span class="spotlight-label tag bold uppercase">{m.header_landing_trending_now()}</span>
      <strong class="spotlight-title ellipsis">{current.title}</strong>
      <span class="spotlight-meta small">
        {toTranslatedType(current.type)}{current.year ? ` · ${current.year}` : ""}
      </span>
      <div class="spotlight-dots">
        {#each items as item, index (item.key)}
          <i class:is-active={index === active}></i>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing-spotlight {
    --card-width: var(--ni-300);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-l);

    min-width: 0;

    @include for-tablet-sm-and-below {
      --card-width: var(--ni-192);
      gap: var(--gap-m);
    }
  }

  .spotlight-cards {
    position: relative;

    width: var(--card-width);
    height: calc(var(--card-width) * 1.5);
  }

  .spotlight-card {
    --shift: 0;
    --tilt: -2deg;
    --scale: 1;

    position: absolute;
    inset: 0;

    transform: translateX(
        calc(var(--card-width) * var(--shift) * var(--rtl-sign))
      )
      rotate(calc(var(--tilt) * var(--rtl-sign))) scale(var(--scale));
    transition:
      transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1),
      opacity 0.9s ease;

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;

      border-radius: var(--border-radius-xl);
      box-shadow:
        0 var(--ni-24) var(--ni-64)
          color-mix(in srgb, var(--shade-1000) 55%, transparent),
        0 0 0 var(--ni-1) color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: var(--layer-background);

      border-radius: var(--border-radius-xl);
      box-shadow: 0 var(--ni-40) var(--ni-120)
        color-mix(in srgb, var(--purple-500) 45%, transparent);

      opacity: 0;
      transition: opacity 0.9s ease;
    }

    &[data-position="front"] {
      z-index: 3;

      &::after {
        opacity: 1;
      }
    }

    &[data-position="next"] {
      --shift: 0.37;
      --tilt: 7deg;
      --scale: 0.86;

      z-index: 2;
      opacity: 0.5;
    }

    &[data-position="after"] {
      --shift: 0.63;
      --tilt: 13deg;
      --scale: 0.72;

      z-index: 1;
      opacity: 0.22;
    }

    &[data-position="leaving"] {
      --shift: -0.53;
      --tilt: -14deg;
      --scale: 1.04;

      z-index: 4;
      opacity: 0;
    }

    &[data-position="hidden"] {
      --shift: 0.8;
      --tilt: 18deg;
      --scale: 0.6;

      opacity: 0;
    }
  }

  .spotlight-caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    width: 100%;
    text-align: center;
  }

  .spotlight-label {
    letter-spacing: 0.08em;
    color: var(--purple-300);
  }

  .spotlight-title {
    width: 100%;

    font-size: var(--ni-24);
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  .spotlight-meta {
    color: var(--landing-color-muted);
  }

  .spotlight-dots {
    display: flex;
    gap: var(--gap-xxs);

    margin-top: var(--gap-xxs);

    i {
      width: var(--ni-24);
      height: var(--ni-3);
      border-radius: var(--ni-3);

      background: color-mix(in srgb, var(--shade-10) 15%, transparent);
      transition: background-color 0.4s ease;

      &.is-active {
        background: var(--purple-400);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spotlight-card,
    .spotlight-card::after {
      transition: none;
    }
  }
</style>
