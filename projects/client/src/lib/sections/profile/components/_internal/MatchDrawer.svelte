<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type {
    UserMatch,
    UserMatchSharedSubgenre,
  } from "$lib/requests/models/UserMatch";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import { matchLabel } from "./matchLabel";
  import { rarityTier, type RarityTier } from "./rarityTier";
  import SharedMediaPoster from "./SharedMediaPoster.svelte";

  const {
    onClose,
    match,
  }: {
    onClose: () => void;
    match: UserMatch;
  } = $props();

  const score = $derived(match.score);
  const label = $derived(matchLabel(score));

  // Cap rendered shared favorites so the drawer doesn't fan out into
  // dozens of summary fetches on open. Server already returns at most
  // 20 per type; we trim further to a compact grid.
  const maxSharedPerType = 6;

  const sharedMovies = $derived(
    match.shared.favorites.movies.slice(0, maxSharedPerType),
  );
  const sharedShows = $derived(
    match.shared.favorites.shows.slice(0, maxSharedPerType),
  );

  // Rare > notable > common > unknown. Server already sorts by
  // watchCount; the secondary sort here floats niche taste agreement
  // to the top of the chip row, where it's the strongest scan signal.
  const tierOrder: Record<RarityTier, number> = {
    rare: 0,
    notable: 1,
    common: 2,
    unknown: 3,
  };
  type DecoratedSubgenre = UserMatchSharedSubgenre & { tier: RarityTier };
  const sharedSubgenres: DecoratedSubgenre[] = $derived(
    [...match.shared.subgenres]
      .map((item) => ({ ...item, tier: rarityTier(item.rarity) }))
      .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]),
  );

  const dasharray = $derived(`${score}, 100`);
</script>

<Drawer {onClose} title={m.match_drawer_title()} size="auto">
  <div class="trakt-match-drawer">
    <div class="hero">
      <div class="gauge">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <path
            class="gauge-track"
            d="M18 2.5a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
          />
          <path
            class="gauge-fill"
            pathLength="100"
            stroke-dasharray={dasharray}
            d="M18 2.5a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
          />
        </svg>
        <div class="readout">
          <span class="score bold">{score}</span><span class="suffix">%</span>
        </div>
      </div>
      <p class="hero-label bold">{label}</p>
    </div>

    <section class="block">
      <header>
        <h3 class="section-title secondary bold">
          {m.match_drawer_breakdown_header()}
        </h3>
      </header>
      <div class="breakdown">
        <div class="breakdown-row">
          <span class="breakdown-label secondary">
            {m.match_drawer_breakdown_topics()}
          </span>
          <div class="bar">
            <span style:width={`${match.breakdown.subgenres}%`}></span>
          </div>
          <span class="breakdown-value">
            {toPercentage(match.breakdown.subgenres / 100, languageTag())}
          </span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label secondary">
            {m.match_drawer_breakdown_favorites()}
          </span>
          <div class="bar">
            <span style:width={`${match.breakdown.favorites}%`}></span>
          </div>
          <span class="breakdown-value">
            {toPercentage(match.breakdown.favorites / 100, languageTag())}
          </span>
        </div>
      </div>
      <p class="caption secondary">{m.match_drawer_breakdown_caption()}</p>
    </section>

    {#if sharedSubgenres.length > 0}
      <section class="block">
        <header>
          <h3 class="section-title secondary">
            {m.match_drawer_shared_topics_header()}
          </h3>
          <span class="count secondary">{sharedSubgenres.length}</span>
        </header>
        <ul class="chips">
          {#each sharedSubgenres as item (item.id)}
            <li class="chip small" data-tier={item.tier}>
              {#if item.tier === "rare"}
                <span class="sparkle" aria-hidden="true">✦</span>
              {/if}
              <span>{item.name}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if sharedMovies.length > 0}
      <section class="block">
        <header>
          <h3 class="section-title secondary">{m.tag_text_movies()}</h3>
          <span class="count secondary">
            {match.shared.favorites.movies.length}
          </span>
        </header>
        <div class="posters">
          {#each sharedMovies as id (`movie-${id}`)}
            <SharedMediaPoster {id} type="movie" />
          {/each}
        </div>
      </section>
    {/if}

    {#if sharedShows.length > 0}
      <section class="block">
        <header>
          <h3 class="section-title secondary">{m.tag_text_shows()}</h3>
          <span class="count secondary">
            {match.shared.favorites.shows.length}
          </span>
        </header>
        <div class="posters">
          {#each sharedShows as id (`show-${id}`)}
            <SharedMediaPoster {id} type="show" />
          {/each}
        </div>
      </section>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .trakt-match-drawer {
    --stroke-width-match-gauge: var(--ni-3);

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    padding-top: var(--gap-m);
  }

  .gauge {
    position: relative;
    width: var(--ni-160);
    height: var(--ni-160);

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
  }

  .gauge-track {
    fill: none;
    stroke: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    stroke-width: var(--stroke-width-match-gauge);
  }

  .gauge-fill {
    fill: none;
    stroke: var(--color-foreground);
    stroke-width: var(--stroke-width-match-gauge);
    stroke-linecap: round;
    transition: stroke-dasharray calc(var(--transition-increment) * 2) ease-out;
  }

  .readout {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .score {
    font-size: 2.5rem;
  }

  .suffix {
    font-size: var(--font-size-separator);
    opacity: 0.6;
    margin-left: 2px;
  }

  .hero-label {
    margin: 0;
    text-align: center;
    font-size: var(--font-size-separator);
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-xs);
  }

  .section-title {
    margin: 0;
    font-size: var(--font-size-tag);
  }

  .count {
    font-variant-numeric: tabular-nums;
    font-size: var(--font-size-text-small);
  }

  .breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .breakdown-row {
    display: grid;
    grid-template-columns: var(--ni-128) 1fr var(--ni-40);
    align-items: center;
    gap: var(--gap-xs);
    font-size: var(--font-size-text-small);
  }

  .breakdown-value {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .bar {
    position: relative;
    height: var(--ni-6);
    border-radius: var(--ni-6);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    overflow: hidden;

    span {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--color-foreground);
      transition: width calc(var(--transition-increment) * 2) ease-out;
    }
  }

  .chips {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-4);
  }

  .chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    padding: var(--ni-4) var(--ni-10);
    border-radius: var(--ni-12);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    border: 1px solid transparent;
    transition: background calc(var(--transition-increment) * 1) ease-out,
      border-color calc(var(--transition-increment) * 1) ease-out,
      box-shadow calc(var(--transition-increment) * 1) ease-out,
      color calc(var(--transition-increment) * 1) ease-out;
  }

  .chip[data-tier="common"] {
    opacity: 0.75;
  }

  .chip[data-tier="notable"] {
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-foreground) 18%, transparent);
  }

  .chip[data-tier="rare"] {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-foreground) 22%, transparent),
      color-mix(in srgb, var(--color-foreground) 10%, transparent)
    );
    border-color: color-mix(in srgb, var(--color-foreground) 40%, transparent);
    box-shadow: 0 0 0 1px
        color-mix(in srgb, var(--color-foreground) 14%, transparent),
      0 var(--ni-2) var(--ni-12)
        color-mix(in srgb, var(--color-foreground) 18%, transparent);
    font-weight: 600;
  }

  .sparkle {
    font-size: 0.85em;
    line-height: 1;
    opacity: 0.85;
  }

  .caption {
    margin: 0;
    font-size: var(--font-size-text-small);
  }

  .posters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }
</style>
