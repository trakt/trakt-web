<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LedgerSection from "../layout/LedgerSection.svelte";
  import Stat from "../layout/Stat.svelte";
  import Tile from "../layout/Tile.svelte";
  import TileGrid from "../layout/TileGrid.svelte";
  import type { MonthReviewTypeStats } from "../models/MonthReviewTypeStats.ts";
  import BarList from "../parts/BarList.svelte";
  import FactGrid from "../parts/FactGrid.svelte";
  import RankedList from "../parts/RankedList.svelte";
  import { toDurationLabel } from "../parts/toDurationLabel.ts";
  import { toPlaysLabel } from "../parts/toPlaysLabel.ts";
  import { toPeakLabels } from "./toPeakLabels.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";

  const RANKED_COUNT = 4;

  const {
    label,
    stats,
    totalPlays,
    year,
    month,
  }: {
    label: string;
    stats: MonthReviewTypeStats;
    totalPlays: number;
    year: number;
    month: number;
  } = $props();

  const locale = getLocale();
  const first = $derived(stats.titles.at(0));
  const rest = $derived(stats.titles.slice(1, RANKED_COUNT + 1));
  const topShare = $derived(
    first && totalPlays > 0
      ? toPercentage(first.plays / totalPlays, locale)
      : undefined,
  );

  const peaks = $derived(
    toPeakLabels({
      dailyPlays: stats.dailyPlays,
      hourlyPlays: stats.hourlyPlays,
      year,
      month,
      locale: languageTag(),
    }),
  );
</script>

{#if stats.plays > 0}
  <div
    class="trakt-month-review-type-section"
    style:--ambient={first ? `url("${first.cover}")` : undefined}
  >
    <LedgerSection {label}>
      <FactGrid columns={6}>
        <Stat
          value={Math.round(stats.minutes / 60)}
          label={m.month_review_label_hours()}
        />
        <Stat value={stats.plays} label={m.month_review_label_plays()} />
        <Stat value={stats.items} label={m.month_review_label_titles()} />
        <Stat
          value={toDurationLabel(stats.minutesPerDay)}
          label={m.month_review_label_hours_per_day()}
        />
        {#if peaks.day}
          <Stat value={peaks.day} label={m.month_review_label_busiest_day()} />
        {/if}
        {#if peaks.hour}
          <Stat value={peaks.hour} label={m.month_review_label_peak_hour()} />
        {/if}
      </FactGrid>

      <TileGrid>
        {#if first}
          <Tile span={stats.genres.length > 0 ? 4 : 6}>
            <div class="tile-head">
              <h3>{m.month_review_most_watched()}</h3>
              {#if first && topShare}
                <span
                  >{m.month_review_top_share({
                    title: first.title,
                    percent: topShare,
                  })}</span
                >
              {/if}
            </div>
            <Link
              href={UrlBuilder.media(first.type, first.slug)}
              label={first.title}
              underline="none"
            >
              <span class="feature">
                <img src={first.cover} alt="" loading="lazy" />
                <span class="feature-copy">
                  <span class="kicker bold">{m.month_review_number_one()}</span>
                  <span class="feature-title bold">{first.title}</span>
                  <span class="feature-meta">
                    {toPlaysLabel(first.plays)}
                    {#if first.minutes !== undefined}
                      · {toDurationLabel(first.minutes)}
                    {/if}
                  </span>
                </span>
              </span>
            </Link>
            {#if rest.length > 0}
              <RankedList titles={rest} start={2}>
                {#snippet trailing(title)}
                  <span>{toPlaysLabel(title.plays)}</span>
                  {#if title.minutes !== undefined}
                    <span>{toDurationLabel(title.minutes)}</span>
                  {/if}
                {/snippet}
              </RankedList>
            {/if}
          </Tile>
        {/if}
        {#if stats.genres.length > 0}
          <Tile span={first ? 2 : 6}>
            <h3>{m.yir_label_top_genres()}</h3>
            <BarList items={stats.genres} />
            <Stat
              value={stats.genreCount}
              label={m.month_review_label_genres()}
            />
          </Tile>
        {/if}
      </TileGrid>
    </LedgerSection>
  </div>
{/if}

<style lang="scss">
  .trakt-month-review-type-section {
    position: relative;
    isolation: isolate;

    &::before {
      content: "";
      position: absolute;
      inset: calc(-1 * var(--ni-80)) -50vw;
      z-index: -1;
      pointer-events: none;
      background-image: var(--ambient, none);
      background-size: cover;
      background-position: center;
      filter: blur(var(--ni-80)) saturate(1.4);
      opacity: var(--month-review-ambient-opacity);
      mask-image: radial-gradient(
        60% 60% at 50% 50%,
        #000 0%,
        transparent 100%
      );
    }
  }

  h3 {
    margin: 0;
    font-size: var(--font-size-title);
  }

  .tile-head {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    span {
      color: var(--color-text-secondary);
    }
  }

  .feature {
    position: relative;
    display: flex;
    align-items: flex-end;
    width: 100%;
    aspect-ratio: 21 / 9;
    min-height: var(--ni-160);
    border-radius: var(--border-radius-l);
    overflow: hidden;
    background: var(--color-month-review-track);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        color-mix(in srgb, var(--shade-1000) 85%, transparent),
        transparent 70%
      );
    }
  }

  .feature-copy {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    padding: var(--gap-m);
    color: var(--shade-10);
  }

  .kicker {
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--shade-200);
  }

  .feature-title {
    font-size: var(--ni-24);
    letter-spacing: -0.02em;
  }

  .feature-meta {
    color: var(--shade-200);
  }
</style>
