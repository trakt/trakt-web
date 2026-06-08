<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserMatch } from "$lib/requests/models/UserMatch";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps.ts";
  import { chipTier } from "./_internal/chipTier.ts";
  import { matchLabel } from "./_internal/matchLabel.ts";
  import SharedMediaPoster from "./_internal/SharedMediaPoster.svelte";

  type MatchDrawerProps = {
    onClose: () => void;
    match: UserMatch;
  } & Pick<DisplayableProfileProps, "profile">;

  const { onClose, match, profile }: MatchDrawerProps = $props();

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

  // Tier is purely positional now: the server already orders chips
  // by `watchCount × rarity` so index 0 is the user's most
  // distinctive shared topic with this person. The sparkle reads as
  // "your hero chip for this pairing" rather than a global rarity
  // claim - always produces visual hierarchy, even for users whose
  // top topics are all globally common slugs.
  const sharedSubgenres = $derived(
    match.shared.subgenres.map((item, index) => ({
      ...item,
      tier: chipTier(index, item.rarity),
    })),
  );

  const dasharray = $derived(`${score}, 100`);
</script>

<Drawer {onClose} title={m.match_drawer_title()} size="auto">
  <div class="trakt-match-drawer">
    <div class="trakt-match-drawer-hero">
      <p class="trakt-match-drawer-hero-subject bold">
        {m.match_drawer_subject({ username: toDisplayableName(profile) })}
      </p>
      <div class="trakt-match-drawer-gauge">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <path
            class="trakt-match-drawer-gauge-track"
            d="M18 2.5a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
          />
          <path
            class="trakt-match-drawer-gauge-fill"
            pathLength="100"
            stroke-dasharray={dasharray}
            d="M18 2.5a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
          />
        </svg>
        <div class="trakt-match-drawer-readout">
          <span class="trakt-match-drawer-score bold">{score}</span>
          <span class="trakt-match-drawer-suffix">%</span>
        </div>
      </div>
      <p class="trakt-match-drawer-hero-label bold">{label}</p>
      <p class="trakt-match-drawer-hero-caption small secondary">
        {m.match_drawer_overlap_caption()}
      </p>
    </div>

    <section class="trakt-match-drawer-block">
      <header class="trakt-match-drawer-section-header">
        <h3 class="trakt-match-drawer-section-title tag secondary bold">
          {m.match_drawer_breakdown_header()}
        </h3>
      </header>
      <div class="trakt-match-drawer-breakdown">
        <div class="trakt-match-drawer-breakdown-row small">
          <span class="trakt-match-drawer-breakdown-label secondary">
            {m.match_drawer_breakdown_topics()}
          </span>
          <div class="trakt-match-drawer-bar">
            <span style:width={`${match.breakdown.subgenres}%`}></span>
          </div>
          <span class="trakt-match-drawer-breakdown-value">
            {toPercentage(match.breakdown.subgenres / 100, languageTag())}
          </span>
        </div>
        <div class="trakt-match-drawer-breakdown-row small">
          <span class="trakt-match-drawer-breakdown-label secondary">
            {m.match_drawer_breakdown_favorites()}
          </span>
          <div class="trakt-match-drawer-bar">
            <span style:width={`${match.breakdown.favorites}%`}></span>
          </div>
          <span class="trakt-match-drawer-breakdown-value">
            {toPercentage(match.breakdown.favorites / 100, languageTag())}
          </span>
        </div>
      </div>
    </section>

    {#if sharedSubgenres.length > 0}
      <section class="trakt-match-drawer-block">
        <header class="trakt-match-drawer-section-header">
          <h3 class="trakt-match-drawer-section-title tag secondary">
            {m.match_drawer_shared_topics_header()}
          </h3>
          <span class="trakt-match-drawer-count small secondary">
            {sharedSubgenres.length}
          </span>
        </header>
        <ul class="trakt-match-drawer-chips">
          {#each sharedSubgenres as item (item.id)}
            <li class="trakt-match-drawer-chip small" data-tier={item.tier}>
              {#if item.tier === "rare" || item.tier === "unicorn"}
                <span class="trakt-match-drawer-sparkle" aria-hidden="true">
                  ✦
                </span>
              {/if}
              <span>{item.name}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if sharedMovies.length > 0}
      <section class="trakt-match-drawer-block">
        <header class="trakt-match-drawer-section-header">
          <h3 class="trakt-match-drawer-section-title tag secondary">
            {m.tag_text_movies()}
          </h3>
          <span class="trakt-match-drawer-count small secondary">
            {match.shared.favorites.movies.length}
          </span>
        </header>
        <div class="trakt-match-drawer-posters">
          {#each sharedMovies as id (`movie-${id}`)}
            <SharedMediaPoster {id} type="movie" />
          {/each}
        </div>
      </section>
    {/if}

    {#if sharedShows.length > 0}
      <section class="trakt-match-drawer-block">
        <header class="trakt-match-drawer-section-header">
          <h3 class="trakt-match-drawer-section-title tag secondary">
            {m.tag_text_shows()}
          </h3>
          <span class="trakt-match-drawer-count small secondary">
            {match.shared.favorites.shows.length}
          </span>
        </header>
        <div class="trakt-match-drawer-posters">
          {#each sharedShows as id (`show-${id}`)}
            <SharedMediaPoster {id} type="show" />
          {/each}
        </div>
      </section>
    {/if}
  </div>
</Drawer>

<style>
  .trakt-match-drawer {
    --stroke-width-match-gauge: var(--ni-3);

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .trakt-match-drawer-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    padding-top: var(--gap-m);
  }

  .trakt-match-drawer-gauge {
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

  .trakt-match-drawer-gauge-track {
    fill: none;
    stroke: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    stroke-width: var(--stroke-width-match-gauge);
  }

  .trakt-match-drawer-gauge-fill {
    fill: none;
    stroke: var(--color-foreground);
    stroke-width: var(--stroke-width-match-gauge);
    stroke-linecap: round;
    transition: stroke-dasharray calc(var(--transition-increment) * 2) ease-out;
  }

  .trakt-match-drawer-readout {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .trakt-match-drawer-score {
    font-size: var(--ni-40);
  }

  .trakt-match-drawer-suffix {
    font-size: var(--font-size-separator);
    opacity: 0.6;
    margin-left: var(--ni-2);
  }

  .trakt-match-drawer-hero-subject {
    text-align: center;
  }

  .trakt-match-drawer-hero-label {
    text-align: center;
    font-size: var(--font-size-separator);
  }

  .trakt-match-drawer-hero-caption {
    text-align: center;
  }

  .trakt-match-drawer-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-match-drawer-section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-xs);
  }

  .trakt-match-drawer-count {
    font-variant-numeric: tabular-nums;
  }

  .trakt-match-drawer-breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-match-drawer-breakdown-row {
    display: grid;
    grid-template-columns: var(--ni-128) 1fr var(--ni-40);
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-match-drawer-breakdown-value {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .trakt-match-drawer-bar {
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

  .trakt-match-drawer-chips {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-4);
  }

  .trakt-match-drawer-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    padding: var(--ni-4) var(--ni-10);
    border-radius: var(--ni-12);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    border: var(--border-thickness-xxs) solid transparent;
    transition:
      background var(--transition-increment) ease-out,
      border-color var(--transition-increment) ease-out,
      box-shadow var(--transition-increment) ease-out,
      color var(--transition-increment) ease-out;
  }

  .trakt-match-drawer-chip[data-tier="common"] {
    opacity: 0.75;
  }

  .trakt-match-drawer-chip[data-tier="notable"] {
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-foreground) 18%, transparent);
  }

  .trakt-match-drawer-chip[data-tier="rare"] {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-foreground) 22%, transparent),
      color-mix(in srgb, var(--color-foreground) 10%, transparent)
    );
    border-color: color-mix(in srgb, var(--color-foreground) 40%, transparent);
    box-shadow:
      0 0 0 var(--ni-1)
        color-mix(in srgb, var(--color-foreground) 14%, transparent),
      0 var(--ni-2) var(--ni-12)
        color-mix(in srgb, var(--color-foreground) 18%, transparent);
    font-weight: 600;
  }

  .trakt-match-drawer-chip[data-tier="unicorn"] {
    --chip-unicorn: #a78bfa;

    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--chip-unicorn) 32%, transparent),
      color-mix(in srgb, var(--chip-unicorn) 14%, transparent)
    );
    border-color: color-mix(in srgb, var(--chip-unicorn) 60%, transparent);
    box-shadow:
      0 0 0 var(--ni-1) color-mix(in srgb, var(--chip-unicorn) 28%, transparent),
      0 var(--ni-2) var(--ni-14)
        color-mix(in srgb, var(--chip-unicorn) 40%, transparent);
    font-weight: 600;

    .trakt-match-drawer-sparkle {
      color: var(--chip-unicorn);
      opacity: 1;
    }
  }

  .trakt-match-drawer-sparkle {
    font-size: 0.85em;
    line-height: 1;
    opacity: 0.85;
  }

  .trakt-match-drawer-posters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
  }
</style>
