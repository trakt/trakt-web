<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import MemberAvatar from "$lib/features/vip-veteran/MemberAvatar.svelte";
  import type { LeaderboardEntry } from "$lib/requests/models/LeaderboardEntry.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { toStatLabel } from "./toStatLabel.ts";

  const { entries }: { entries: ReadonlyArray<LeaderboardEntry> } = $props();

  const locale = $derived(languageTag());

  const spots = $derived(
    entries.map((entry, index) => ({
      entry,
      place: entry.rank ?? index + 1,
      hours:
        entry.totalMinutes == null
          ? null
          : toHumanNumber(Math.round(entry.totalMinutes / 60), locale),
      plays:
        entry.totalPlays == null
          ? null
          : toStatLabel(entry.totalPlays, "plays", locale),
    })),
  );
</script>

<ol class="trakt-leaderboard-podium">
  {#each spots as spot (spot.entry.key)}
    <li class="podium-spot" data-place={spot.place}>
      <Link
        href={spot.entry.user.slug
          ? UrlBuilder.profile.user(spot.entry.user.slug)
          : undefined}
        color="inherit"
      >
        <span class="podium-box">
          <span class="podium-face">
            <MemberAvatar member={spot.entry.user} size="large">
              <CrossOriginImage
                src={spot.entry.user.avatar.url}
                alt={m.image_alt_user_avatar({
                  username: spot.entry.user.username,
                })}
              />
            </MemberAvatar>
          </span>
        </span>
      </Link>

      <span class="podium-rank bold">#{spot.place}</span>
      <span class="podium-name bold ellipsis">
        {toDisplayableName(spot.entry.user)}
      </span>
      <span class="podium-score">
        {#if spot.hours}
          <span class="score-value bold">{spot.hours}</span>
          <span class="score-unit small secondary">{m.stat_label_hours()}</span>
        {/if}
      </span>
      <span class="podium-plays small secondary">{spot.plays ?? ""}</span>
    </li>
  {/each}
</ol>

<style lang="scss">
  .trakt-leaderboard-podium {
    --tier-aura-surface: var(--color-drawer-background);

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(5, auto);
    column-gap: var(--ni-4);
    row-gap: var(--ni-6);

    margin: 0;
    padding: var(--gap-m) 0 var(--gap-s);
    list-style: none;
    overflow: clip;

    --podium-rise-offset: var(--ni-12);
    --podium-rise-scale: 0.95;
    --podium-stagger: calc(var(--transition-increment) / 2);
  }

  .podium-spot {
    --podium-face: var(--ni-72);
    --medal-color: var(--color-medal-silver);
    --medal-glow: 22%;
    --podium-step: 1;

    order: 1;

    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
    justify-items: center;
    align-items: center;
    min-width: 0;

    &[data-place="1"] {
      --podium-face: var(--ni-88);
      --medal-color: var(--color-medal-gold);
      --medal-glow: 36%;
      --podium-step: 2;

      order: 2;
    }

    &[data-place="3"] {
      --medal-color: var(--color-medal-bronze);
      --podium-step: 0;

      order: 3;
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: podium-rise var(--transition-spring-duration)
        var(--transition-spring-ease)
        calc(var(--podium-stagger) * var(--podium-step)) both;
    }

    :global(.trakt-link) {
      align-self: end;
      text-decoration: none;
    }
  }

  .podium-box {
    position: relative;
    isolation: isolate;

    display: grid;
    place-items: center;
    inline-size: calc(var(--podium-face) / var(--tier-aura-full-face-share));
    block-size: calc(var(--podium-face) / var(--tier-aura-full-face-share));
  }

  .podium-box::before {
    content: "";

    position: absolute;
    inset: -12%;
    z-index: -1;

    border-radius: 50%;
    background: radial-gradient(
      closest-side,
      color-mix(in srgb, var(--medal-color) var(--medal-glow), transparent),
      transparent
    );
    pointer-events: none;
  }

  .podium-face {
    display: block;
    inline-size: var(--podium-face);
    block-size: var(--podium-face);

    :global(img) {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  }

  .podium-rank {
    padding: var(--ni-2) var(--ni-10);

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--medal-color) 16%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--medal-color) 55%, transparent);

    font-size: var(--font-size-text-small);
    font-variant-numeric: tabular-nums;
    color: var(--medal-color);
  }

  .podium-name {
    max-width: 100%;
  }

  .podium-score {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ni-4);
    font-variant-numeric: tabular-nums;
  }

  .score-value {
    font-size: var(--font-size-title);
    line-height: 1;
  }

  .podium-plays {
    font-variant-numeric: tabular-nums;
  }

  @keyframes podium-rise {
    from {
      opacity: 0;
      transform: translateY(var(--podium-rise-offset))
        scale(var(--podium-rise-scale));
    }
  }
</style>
