<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { YirMostWatchedItem } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    type,
    items,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    items: ReadonlyArray<YirMostWatchedItem>;
  } = $props();

  const lead = $derived(items.at(0));
  const rest = $derived(items.slice(1));
  const url = (item: YirMostWatchedItem) =>
    UrlBuilder.media(item.entry.type, item.entry.slug);
</script>

<YirScene
  {id}
  {index}
  kicker={m.yir_label_most_watched({
    type: type === "shows" ? m.yir_unit_shows() : m.yir_unit_movies(),
  })}
  title={type === "shows"
    ? m.yir_2024_most_watched_shows()
    : m.yir_2024_most_watched_movies()}
>
  {#snippet children()}
    {#if lead}
      <Link href={url(lead)} color="inherit">
        <article class="yir-top-lead" data-reveal style:--d="calc(var(--yir-beat) * 2)">
          <div class="yir-top-cover">
            <CrossOriginImage src={lead.entry.cover.url.medium} alt="" />
          </div>
          <span class="yir-top-rank is-lead" aria-hidden="true">1</span>
          <div class="yir-top-lead-copy">
            <span data-hover-line class="yir-top-lead-title">{lead.entry.title}</span>
            <dl>
              <div>
                <dt>{m.yir_2024_plays_label()}</dt>
                <dd>{formatNumber(lead.plays)}</dd>
              </div>
              <div>
                <dt>{m.yir_2024_time_watched_label()}</dt>
                <dd>{toHumanDuration({ minutes: lead.minutes }, languageTag())}</dd>
              </div>
            </dl>
          </div>
        </article>
      </Link>
    {/if}

    {#if rest.length > 0}
      <ol class="yir-top-rail">
        {#each rest as item, position (item.entry.key)}
          <li data-reveal style:--d="calc(var(--yir-beat) * {position} * 0.6)">
            <Link href={url(item)} color="inherit">
              <div class="yir-top-poster">
                <CrossOriginImage src={item.entry.poster.url.medium} alt="" />
                <span class="yir-top-rank" aria-hidden="true">{position + 2}</span>
              </div>
              <span data-hover-line class="yir-top-title">{item.entry.title}</span>
              <span class="yir-top-plays">
                {m.yir_2024_stats_card_plays({ count: formatNumber(item.plays) })}
              </span>
            </Link>
          </li>
        {/each}
      </ol>
    {/if}
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-top-lead {
    position: relative;
    display: grid;
    gap: var(--ni-24);
  }

  .yir-top-cover {
    position: relative;
    aspect-ratio: 2.39 / 1;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-yir-surface-chip);

    @media (max-width: 40rem) {
      aspect-ratio: 16 / 10;
    }

    :global(img) {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .yir-top-rank {
    font-family: var(--yir-font-display);
    line-height: 0.8;
    color: transparent;
    -webkit-text-stroke: var(--ni-2) var(--color-yir-accent);
    font-variant-numeric: tabular-nums;

    &.is-lead {
      position: absolute;
      inset-inline-start: var(--ni-16);
      top: 0;
      font-size: clamp(var(--ni-120), 22vw, var(--ni-320));
      color: var(--color-yir-accent);
      -webkit-text-stroke: 0;
      transform: translateY(-40%);
      text-shadow: 0 var(--ni-8) var(--ni-32)
        color-mix(in srgb, var(--color-yir-background) 60%, transparent);
    }
  }

  .yir-top-lead-copy {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--ni-24);

    dl {
      display: flex;
      gap: var(--ni-32);
      margin: 0;
    }

    div {
      display: flex;
      flex-direction: column-reverse;
    }

    dt {
      font-family: var(--yir-font-mono);
      font-size: var(--font-size-tag);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-yir-text-muted);
    }

    dd {
      margin: 0;
      font-family: var(--yir-font-display);
      font-size: clamp(var(--ni-24), 3vw, var(--ni-40));
      color: var(--color-yir-accent);
    }
  }

  .yir-top-lead-title {
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-40), 6vw, var(--ni-80));
    line-height: 0.95;
  }

  .yir-top-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(var(--ni-144), 1fr);
    gap: var(--ni-24);
    margin: 0;
    padding: var(--ni-24) 0 var(--ni-8);
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
      grid-template-columns: repeat(auto-fill, minmax(var(--ni-160), 1fr));
      overflow: visible;
    }
  }

  .yir-top-poster {
    container-type: inline-size;
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-s);
    background: var(--color-yir-surface-chip);

    :global(img) {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      transition: transform var(--transition-increment) ease-out;
    }

    .yir-top-rank {
      position: absolute;
      inset-inline-start: calc(-1 * var(--ni-8));
      bottom: calc(-1 * var(--ni-8));
      font-size: clamp(var(--ni-56), 28cqi, var(--ni-80));
    }
  }

  @include for-mouse {
    .yir-top-rail li:hover .yir-top-poster :global(img) {
      transform: translateY(calc(-1 * var(--ni-6)));
    }
  }

  .yir-top-title {
    margin-top: var(--ni-20);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .yir-top-plays {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);
  }

  .yir-top-rank.is-lead {
    transition:
      opacity calc(var(--yir-beat) * 9) ease calc(var(--yir-beat) * 5),
      translate calc(var(--yir-beat) * 9) var(--yir-ease) calc(var(--yir-beat) * 5),
      scale calc(var(--yir-beat) * 9) var(--yir-ease) calc(var(--yir-beat) * 5);
  }

  :global(.trakt-yir-scene:not(.is-in)) .yir-top-rank.is-lead {
    opacity: 0;
    translate: -0.2em 0;
    scale: 0.85;
  }

  .yir-top-cover :global(img),
  .yir-top-rank {
    transition:
      scale calc(var(--yir-beat) * 14) var(--yir-ease),
      color calc(var(--yir-beat) * 3) ease;
  }

  @media (hover: hover) {
    .yir-top-lead:hover .yir-top-cover :global(img) {
      scale: 1.04;
    }

    .yir-top-rail li:hover .yir-top-rank {
      color: var(--color-yir-accent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-top-rank.is-lead,
    :global(.trakt-yir-scene:not(.is-in)) .yir-top-rank.is-lead {
      opacity: 1;
      translate: none;
      scale: none;
      transition: none;
    }
  }
</style>
