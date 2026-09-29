<script lang="ts">
  import { GenreIntlProvider } from "$lib/components/summary/GenreIntlProvider";
  import * as m from "$lib/features/i18n/messages";
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { yirMediaUnit } from "../../../_internal/yirMediaUnit";
  import YirRankBars from "./YirRankBars.svelte";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    type,
    group,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    group: YirGenresGroup;
  } = $props();

  const sorted = $derived([...group.genres].sort((a, b) => b.count - a.count));
  const unit = (count: number) => `${formatNumber(count)} ${yirMediaUnit(type, count)}`;
  const top = $derived(sorted.at(0));
  const least = $derived(sorted.at(-1));
  const rows = $derived(
    sorted.slice(0, 8).map((genre) => ({
      key: genre.slug,
      name: GenreIntlProvider.genre(genre.name),
      value: genre.count,
      detail: unit(genre.count),
    })),
  );
</script>

<YirScene
  {id}
  {index}
  kicker={m.yir_label_top_genres()}
  title={type === "shows"
    ? m.yir_2024_most_watched_show_genres()
    : m.yir_2024_most_watched_movie_genres()}
>
  {#snippet children(isInView)}
    {#if top}
      <div class="yir-genre-top" data-reveal style:--d="calc(var(--yir-beat) * 2)">
        <span class="yir-genre-top-name">{GenreIntlProvider.genre(top.name)}</span>
        <span class="yir-genre-top-count">{unit(top.count)}</span>
      </div>
    {/if}

    <div class="yir-genres">
      <YirRankBars {rows} active={isInView} />

      <dl class="yir-genre-facts" data-reveal>
        {#if least && least !== top}
          <div>
            <dt>{m.yir_2024_stat_least_watched()}</dt>
            <dd>{GenreIntlProvider.genre(least.name)}</dd>
            <span>{unit(least.count)}</span>
          </div>
        {/if}
        <div>
          <dt>{m.yir_2024_genre_count()}</dt>
          <dd>{formatNumber(group.genres.length)}</dd>
        </div>
      </dl>
    </div>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-genre-top {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--ni-24);
  }

  .yir-genre-top-name {
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-36), 9cqi, var(--ni-200));
    line-height: 0.9;
    color: var(--color-yir-accent);
    overflow-wrap: break-word;
  }

  .yir-genre-top-count {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-text);
    color: var(--color-yir-text-secondary);
  }

  .yir-genres {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48);

    @include for-desktop {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
  }

  .yir-genre-facts {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
    margin: 0;

    div {
      display: flex;
      flex-direction: column;
      gap: var(--ni-6);
      padding-top: var(--ni-16);
      border-top: var(--ni-2) solid var(--color-yir-accent);
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
      font-size: clamp(var(--ni-28), 3.6vw, var(--ni-48));
      line-height: 1.05;
    }

    span {
      color: var(--color-yir-text-secondary);
    }
  }

  .yir-genre-facts div {
    position: relative;
    border-top-color: transparent;

    &::before {
      content: "";
      position: absolute;
      top: calc(-1 * var(--ni-2));
      inset-inline: 0;
      height: var(--ni-2);
      background: var(--color-yir-accent);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform var(--yir-t-hero) var(--yir-ease) calc(var(--yir-beat) * 5);

      :global([dir="rtl"]) & {
        transform-origin: right center;
      }
    }
  }

  :global(.is-in) .yir-genre-facts div::before {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-genre-facts div::before {
      transform: scaleX(1);
      transition: none;
    }
  }
</style>
