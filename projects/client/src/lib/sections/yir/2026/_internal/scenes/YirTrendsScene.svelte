<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { YirTrendItem } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    type,
    items,
    year,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    items: ReadonlyArray<YirTrendItem>;
    year: number;
  } = $props();

  const ordered = $derived([...items].sort((a, b) => a.month - b.month));
  const watched = $derived(items.filter((item) => item.watched).length);
</script>

<YirScene
  {id}
  {index}
  kicker={type === "shows" ? m.yir_2024_show_trends() : m.yir_2024_movie_trends()}
  title={m.yir_2026_trends_score({ watched, total: items.length })}
  lead={type === "shows"
    ? m.yir_2024_trends_subtitle_shows({ year })
    : m.yir_2024_trends_subtitle_movies({ year })}
>
  {#snippet children()}
    <ol class="yir-trends">
      {#each ordered as item, position (item.entry.key)}
        <li class:is-watched={item.watched} data-reveal style:--d="calc(var(--yir-beat) * {position} * 0.5)">
          <Link href={UrlBuilder.media(item.entry.type, item.entry.slug)} color="inherit">
            <span class="yir-trend-month">
              {toHumanMonth(new Date(year, item.month - 1, 1), languageTag(), "short")}
            </span>
            <div class="yir-trend-poster">
              <CrossOriginImage src={item.entry.poster.url.medium} alt="" />
              <span class="yir-trend-stamp">
                {item.watched ? m.yir_2024_trend_watched() : m.yir_2026_trend_missed()}
              </span>
            </div>
            <span data-hover-line class="yir-trend-title">{item.entry.title}</span>
            <span class="yir-trend-watchers">
              {m.yir_2024_trend_watchers({ count: formatNumber(item.watchers) })}
            </span>
          </Link>
        </li>
      {/each}
    </ol>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-trends {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(var(--ni-144), 1fr);
    gap: var(--ni-20);
    margin: 0;
    padding: 0 0 var(--ni-8);
    list-style: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    li {
      scroll-snap-align: start;
      min-width: 0;
    }

    :global(a) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-8);
    }

    @include for-desktop {
      grid-auto-flow: row;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      overflow: visible;
    }
  }

  .yir-trend-month {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
  }

  .yir-trend-poster {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-yir-surface-chip);

    :global(img) {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1);
      opacity: 0.45;
    }
  }

  .is-watched .yir-trend-poster {
    box-shadow: 0 0 0 var(--ni-2) var(--color-yir-accent);

    :global(img) {
      filter: none;
      opacity: 1;
    }
  }

  .yir-trend-stamp {
    position: absolute;
    top: var(--ni-8);
    inset-inline-end: var(--ni-8);
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xs);
    border: var(--ni-1) solid var(--color-yir-text-primary);
    background: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    text-transform: uppercase;
    transform: rotate(6deg);
  }

  .is-watched .yir-trend-stamp {
    border-color: var(--color-yir-accent);
    background: var(--color-yir-accent);
    color: var(--color-yir-background);
  }

  .yir-trend-title {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .yir-trend-watchers {
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);
  }

  .yir-trend-stamp {
    transition:
      transform calc(var(--yir-beat) * 4.5) cubic-bezier(0.3, 1.6, 0.5, 1),
      opacity calc(var(--yir-beat) * 2) ease;
    transition-delay: calc(var(--d, 0ms) + var(--yir-beat) * 7);
  }

  :global(.trakt-yir-scene:not(.is-in)) .yir-trend-stamp {
    opacity: 0;
    transform: rotate(-10deg) scale(1.8);
  }

  .yir-trend-poster :global(img) {
    transition:
      filter calc(var(--yir-beat) * 5) ease,
      opacity calc(var(--yir-beat) * 5) ease,
      scale var(--yir-t-reveal) var(--yir-ease);
  }

  @media (hover: hover) {
    .yir-trends li:hover .yir-trend-poster :global(img) {
      filter: none;
      opacity: 1;
      scale: 1.04;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-trend-stamp,
    :global(.trakt-yir-scene:not(.is-in)) .yir-trend-stamp {
      opacity: 1;
      transform: rotate(6deg);
      transition: none;
    }
  }
</style>
