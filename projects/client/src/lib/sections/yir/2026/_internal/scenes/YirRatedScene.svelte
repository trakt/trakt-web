<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { YirTopRatedItem } from "$lib/requests/models/YirDetail";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirScene from "./YirScene.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";
  import YirStars from "./YirStars.svelte";

  const {
    id,
    index,
    type,
    items,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    items: ReadonlyArray<YirTopRatedItem>;
  } = $props();

  let activeIndex = $state(0);
  const active = $derived(items.at(activeIndex) ?? items.at(0));
</script>

<YirScene
  {id}
  {index}
  kicker={m.yir_unit_ratings()}
  title={type === "shows"
    ? m.yir_2024_highest_rated_shows()
    : m.yir_2024_highest_rated_movies()}
>
  {#snippet children()}
    <div class="yir-rated">
      {#if active}
        <div class="yir-rated-poster" data-reveal style:--d="calc(var(--yir-beat) * 2)">
          {#key active.entry.key}
            <CrossOriginImage src={active.entry.poster.url.medium} alt="" />
            <span
              class="yir-rated-score"
              aria-label={m.yir_2026_top_rated_rating({ rating: active.rating })}
            >
              <StarIcon fill="full" />
              {toUserRating(active.rating, getLocale())}
            </span>
          {/key}
        </div>
      {/if}

      <ol class="yir-rated-list">
        {#each items.slice(0, 10) as item, position (item.entry.key)}
          <li
            class:is-active={position === activeIndex}
            data-reveal
            style:--d="calc(var(--yir-beat) * {position} * 0.5)"
            onpointerenter={() => (activeIndex = position)}
            onfocusin={() => (activeIndex = position)}
          >
            <span class="yir-rated-rank">{String(position + 1).padStart(2, "0")}</span>
            <Link
              href={UrlBuilder.media(item.entry.type, item.entry.slug)}
              color="inherit"
            >
              <span data-hover-line class="yir-rated-title">{item.entry.title}</span>
            </Link>
            <YirStars rating={item.rating} />
          </li>
        {/each}
      </ol>
    </div>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-rated {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48);
    align-items: start;

    @include for-desktop {
      grid-template-columns: minmax(0, var(--ni-380)) minmax(0, 1fr);
    }
  }

  .yir-rated-poster {
    position: relative;
    width: min(100%, var(--ni-320));
    aspect-ratio: 2 / 3;
    justify-self: center;
    border-radius: var(--border-radius-m);
    background: var(--color-yir-surface-chip);

    @include for-desktop {
      position: sticky;
      top: var(--ni-104);
      width: 100%;
    }

    :global(img) {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      animation: poster-in calc(var(--yir-beat) * 5) ease both;
    }
  }

  .yir-rated-score {
    position: absolute;
    inset-inline-end: calc(-1 * var(--ni-16));
    bottom: calc(-1 * var(--ni-16));
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    padding: var(--ni-10) var(--ni-16);
    border-radius: var(--border-radius-xxl);
    background: var(--color-yir-accent);
    color: var(--color-yir-background);
    font-family: var(--yir-font-display);
    font-size: var(--ni-32);
    line-height: 1;
    font-variant-numeric: tabular-nums;

    :global(svg) {
      width: 0.8em;
      height: 0.8em;
    }
  }


  .yir-rated-list {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ni-16);
      padding-block: var(--ni-16);
      border-bottom: var(--ni-1) solid var(--color-yir-separator);
    }

    li.is-active {
      border-bottom-color: var(--color-yir-accent);
    }
  }

  .yir-rated-rank {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);
  }

  .yir-rated-title {
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-20), 2.6vw, var(--ni-32));
    line-height: 1.1;
  }

  .is-active .yir-rated-title,
  .is-active .yir-rated-rank {
    color: var(--color-yir-text-accent);
  }

  @keyframes poster-in {
    from {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-rated-poster :global(img) {
      animation: none;
    }
  }

  .yir-rated-poster :global(img) {
    animation: rated-poster-in calc(var(--yir-beat) * 6) var(--yir-ease) both;
  }

  .yir-rated-score {
    animation: rated-score-pop calc(var(--yir-beat) * 5) cubic-bezier(0.3, 1.6, 0.5, 1) calc(var(--yir-beat) * 1.2) both;
  }

  .yir-rated-list li {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      inset-inline: 0;
      bottom: calc(-1 * var(--ni-1));
      height: var(--ni-2);
      background: var(--color-yir-accent);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform calc(var(--yir-beat) * 5) var(--yir-ease);

      :global([dir="rtl"]) & {
        transform-origin: right center;
      }
    }

    &.is-active::after {
      transform: scaleX(1);
    }
  }

  .yir-rated-title,
  .yir-rated-rank {
    transition: color var(--yir-t-quick) ease;
  }

  @keyframes rated-poster-in {
    from {
      opacity: 0;
      scale: 1.04;
    }
  }

  @keyframes rated-score-pop {
    from {
      scale: 0.4;
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-rated-poster :global(img),
    .yir-rated-score {
      animation: none;
    }

    .yir-rated-list li::after {
      transition: none;
    }
  }
</style>
