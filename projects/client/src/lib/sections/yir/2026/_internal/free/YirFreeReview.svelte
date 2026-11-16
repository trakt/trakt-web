<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import PosterRow from "$lib/sections/review/PosterRow.svelte";
  import RateNudge from "$lib/sections/review/RateNudge.svelte";
  import VipPanel from "$lib/sections/review/VipPanel.svelte";
  import { toLocaleWeekdays } from "$lib/sections/yir/_internal/toLocaleWeekdays.ts";
  import { formatDecimal } from "$lib/utils/format/formatDecimal";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { setMonth } from "date-fns/setMonth";
  import YirBars from "../scenes/YirBars.svelte";
  import YirScene from "../scenes/YirScene.svelte";
  import type { FreeYearReview } from "./FreeYearReview";
  import YirFreeHero from "./YirFreeHero.svelte";

  const {
    review,
    year,
  }: {
    review: FreeYearReview | null;
    year: number;
  } = $props();

  const MAX_TOP_TITLES = 10;

  const { user } = useUser();

  const watched = $derived(review?.watched ?? null);
  const stats = $derived(review?.stats ?? null);
  const hasPlays = $derived((watched?.plays ?? 0) > 0);
  const unrated = $derived(watched?.unrated ?? []);
  const topTitles = $derived((watched?.titles ?? []).slice(0, MAX_TOP_TITLES));
  const moviePlays = $derived((watched?.plays ?? 0) - (watched?.episodes ?? 0));

  const monthName = (month: number, format?: "short") =>
    toHumanMonth(setMonth(new Date(0), month), languageTag(), format);

  const monthly = $derived(
    (stats?.monthPlays ?? []).map((value, month) => ({
      value,
      label: monthName(month, "short"),
      main: m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) }),
      sub: monthName(month),
    })),
  );

  const peakMonth = $derived.by(() => {
    const plays = stats?.monthPlays ?? [];
    return plays.indexOf(Math.max(...plays));
  });

  const weekdays = $derived.by(() => {
    const short = new Intl.DateTimeFormat(languageTag(), { weekday: "short" });
    const long = new Intl.DateTimeFormat(languageTag(), { weekday: "long" });

    return toLocaleWeekdays(stats?.weekdayPlays ?? [], getLocale()).map(
      ({ value, date }) => ({
        key: date.getDay(),
        value,
        label: short.format(date),
        main: m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) }),
        sub: long.format(date),
      }),
    );
  });

  const peakWeekday = $derived(
    weekdays.reduce(
      (best, day) => (best && best.value >= day.value ? best : day),
      weekdays.at(0),
    ),
  );

  const ratingBars = $derived(
    (stats?.ratings.distribution ?? []).map((value, index) => ({
      value,
      label: String(index + 1),
      main: formatNumber(value),
      sub: String(index + 1),
    })),
  );

  const formatDate = (date: Date) => toHumanShortDate(date, languageTag());
</script>

<YirFreeHero
  {watched}
  {year}
  name={$user ? toDisplayableName($user) : ""}
  avatarUrl={$user?.avatar.url ?? ""}
  joinedAt={$user?.joinedAt}
/>

{#if review && !hasPlays}
  <p class="trakt-yir-free-empty">
    {m.month_review_empty({ month: String(year) })}
  </p>
{/if}

{#if stats && hasPlays}
  <YirScene
    id="section-months"
    index={1}
    kicker={m.yir_free_months_kicker()}
    title={m.yir_free_months_title({ month: monthName(peakMonth) })}
  >
    {#snippet children(isInView)}
      <div class="yir-free-chart" data-reveal>
        <span class="yir-free-label">{m.yir_free_plays_by_month()}</span>
        <YirBars bars={monthly} active={isInView} />
      </div>
    {/snippet}
  </YirScene>

  <YirScene
    id="section-rhythm"
    index={2}
    kicker={m.yir_free_rhythm_kicker()}
    title={m.yir_free_rhythm_title({ weekday: peakWeekday?.sub ?? "" })}
  >
    {#snippet children(isInView)}
      <div class="yir-free-split">
        <div class="yir-free-chart" data-reveal>
          <span class="yir-free-label">{m.yir_free_plays_by_weekday()}</span>
          <YirBars bars={weekdays} active={isInView} />
        </div>
        <dl class="yir-free-facts" data-reveal style:--d="var(--yir-beat)">
          {#if stats.streak}
            <div>
              <dt>{m.yir_free_streak()}</dt>
              <dd>
                {formatNumber(stats.streak.days)}
                {m.yir_2026_highlight_streak_days()}
              </dd>
              <span>
                {formatDate(stats.streak.start)} - {formatDate(
                  stats.streak.end,
                )}
              </span>
            </div>
          {/if}
          {#if stats.firstPlay}
            <div>
              <dt>{m.yir_free_first_play({ year })}</dt>
              <dd>{formatDate(stats.firstPlay)}</dd>
            </div>
          {/if}
        </dl>
      </div>
    {/snippet}
  </YirScene>

  {#if watched}
    <YirScene
      id="section-split"
      index={3}
      kicker={m.yir_free_split_kicker()}
      title={watched.episodes >= moviePlays
        ? m.yir_free_split_title_shows()
        : m.yir_free_split_title_movies()}
    >
      {#snippet children()}
        <dl class="yir-free-facts" data-reveal>
          <div>
            <dt>{m.yir_free_label_episodes()}</dt>
            <dd>{formatNumber(watched.episodes)}</dd>
          </div>
          <div>
            <dt>{m.month_review_label_shows()}</dt>
            <dd>{formatNumber(watched.shows)}</dd>
          </div>
          <div>
            <dt>{m.yir_free_label_movie_plays()}</dt>
            <dd>{formatNumber(moviePlays)}</dd>
          </div>
          <div>
            <dt>{m.month_review_label_movies()}</dt>
            <dd>{formatNumber(watched.movies)}</dd>
          </div>
        </dl>
      {/snippet}
    </YirScene>

    <YirScene
      id="section-top"
      index={4}
      kicker={m.yir_free_top_kicker()}
      title={m.yir_free_top_title()}
    >
      {#snippet children()}
        <div class="yir-free-top" data-reveal>
          <PosterRow titles={topTitles} />
          {#if unrated.length > 0}
            <RateNudge titles={unrated} period="year" />
          {/if}
        </div>
      {/snippet}
    </YirScene>
  {/if}

  {#if stats.ratings.count > 0}
    <YirScene
      id="section-ratings"
      index={5}
      kicker={m.yir_free_ratings_kicker()}
      title={m.yir_free_ratings_title({
        average: formatDecimal(stats.ratings.average),
      })}
    >
      {#snippet children(isInView)}
        <div class="yir-free-split">
          <div class="yir-free-chart" data-reveal>
            <YirBars bars={ratingBars} active={isInView} />
          </div>
          <dl class="yir-free-facts" data-reveal style:--d="var(--yir-beat)">
            <div>
              <dt>{m.month_review_label_rated()}</dt>
              <dd>{formatNumber(stats.ratings.count)}</dd>
            </div>
            {#if stats.favorites > 0}
              <div>
                <dt>{m.yir_free_label_favorites()}</dt>
                <dd>{formatNumber(stats.favorites)}</dd>
              </div>
            {/if}
          </dl>
        </div>
      {/snippet}
    </YirScene>
  {/if}
{/if}

{#if review}
  <section class="trakt-yir-free-more">
    <div class="yir-free-more-inner">
      <span class="yir-free-label">
        {m.month_review_section_more({ month: String(year) })}
      </span>
      <VipPanel {year} periodName={String(year)} />
    </div>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-free-empty {
    margin: 0;
    padding: var(--ni-48) var(--ni-24);
    text-align: center;
    font-size: var(--font-size-title);
    color: var(--color-yir-text-secondary);
  }

  .yir-free-label,
  .yir-free-facts dt {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
  }

  .yir-free-chart {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    min-width: 0;
  }

  .yir-free-split {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: end;
    gap: var(--ni-48);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-32);
    }
  }

  .yir-free-facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--ni-160), 1fr));
    gap: var(--ni-32);
    margin: 0;

    div {
      display: flex;
      flex-direction: column;
      gap: var(--ni-6);
      padding-top: var(--ni-16);
      border-top: var(--ni-1) solid var(--color-yir-separator);
    }

    dd {
      margin: 0;
      font-family: var(--yir-font-display);
      font-size: clamp(var(--ni-28), 5vw, var(--ni-48));
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    span {
      color: var(--color-yir-text-secondary);
    }
  }

  .yir-free-top {
    display: flex;
    flex-direction: column;
    gap: var(--ni-40);
  }

  .trakt-yir-free-more {
    padding-block: var(--ni-72) var(--ni-120);
    border-top: var(--ni-1) solid var(--color-yir-separator);
  }

  .yir-free-more-inner {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    box-sizing: border-box;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding-inline: var(--ni-24);

    @include for-tablet-lg {
      padding-inline: var(--ni-48);
    }

    @include for-desktop {
      padding-inline: var(--ni-72);
    }
  }
</style>
