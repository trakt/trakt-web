<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import TierAura from "$lib/components/tier-aura/TierAura.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toVipTier } from "$lib/features/vip-veteran/toVipTier.ts";
  import type { LeaderboardEntry } from "$lib/requests/models/LeaderboardEntry.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { toStatLabel } from "./toStatLabel.ts";

  const { entries }: { entries: ReadonlyArray<LeaderboardEntry> } = $props();

  const locale = $derived(languageTag());

  // First place stands in the middle, second to its left, third to its right.
  const spots = $derived(
    entries.map((entry, index) => ({
      entry,
      place: entry.rank ?? index + 1,
      order: [2, 1, 3][index] ?? index + 1,
      hours:
        entry.totalMinutes == null
          ? null
          : toStatLabel(Math.round(entry.totalMinutes / 60), "hours", locale),
    })),
  );
</script>

<!-- The top three wear their full aura, live; everyone else is a list row. -->
<ol class="trakt-leaderboard-podium">
  {#each spots as spot (spot.entry.key)}
    <li class="podium-spot" data-place={spot.place} style:order={spot.order}>
      <Link
        href={spot.entry.user.slug
          ? UrlBuilder.profile.user(spot.entry.user.slug)
          : undefined}
        color="inherit"
      >
        <span class="podium-box">
          <span class="podium-face">
            <TierAura
              tier={toVipTier(spot.entry.user)}
              variant="full"
              motion="live"
            >
              <CrossOriginImage
                src={spot.entry.user.avatar.url}
                alt={m.image_alt_user_avatar({
                  username: spot.entry.user.username,
                })}
              />
            </TierAura>
          </span>
        </span>
      </Link>

      <span class="podium-rank bold">#{spot.place}</span>
      <span class="podium-name bold ellipsis">
        {toDisplayableName(spot.entry.user)}
      </span>
      {#if spot.hours}
        <span class="podium-hours secondary">{spot.hours}</span>
      {/if}
    </li>
  {/each}
</ol>

<style lang="scss">
  .trakt-leaderboard-podium {
    --tier-aura-surface: var(--color-drawer-background);

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
    gap: var(--ni-4);

    margin: 0;
    padding: var(--gap-m) 0 var(--gap-s);
    list-style: none;
  }

  .podium-spot {
    --podium-face: var(--ni-72);
    --medal-color: var(--color-medal-silver);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);
    min-width: 0;

    &[data-place="1"] {
      --podium-face: var(--ni-88);
      --medal-color: var(--color-medal-gold);
    }

    &[data-place="3"] {
      --medal-color: var(--color-medal-bronze);
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  /*
    Every spot shares the box first place's cut needs (its face plus the
    setting), so the ranks and names below sit on one line.
  */
  .podium-box {
    display: grid;
    place-items: center;
    inline-size: calc(var(--ni-88) * 100 / 70);
    block-size: calc(var(--ni-88) * 100 / 70);
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
    font-size: var(--font-size-text-small);
    font-variant-numeric: tabular-nums;
    color: var(--medal-color);
  }

  .podium-name {
    max-width: 100%;
  }

  .podium-hours {
    font-size: var(--font-size-text-small);
    font-variant-numeric: tabular-nums;
  }
</style>
