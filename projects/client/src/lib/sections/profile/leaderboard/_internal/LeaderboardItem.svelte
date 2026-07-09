<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { LeaderboardEntry } from "$lib/requests/models/LeaderboardEntry.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { toStatLabel } from "./toStatLabel.ts";

  const { entry }: { entry: LeaderboardEntry } = $props();

  const locale = $derived(languageTag());
  const displayName = $derived(toDisplayableName(entry.user));

  const profileHref = $derived(
    entry.user.slug == null
      ? undefined
      : UrlBuilder.profile.user(entry.user.slug),
  );

  // Free follows carry no computed rank/stats. Render a stable placeholder
  // (derived from the user id, so it doesn't flicker) behind a blur - the
  // avatar and username stay clear.
  const isLockedFollow = $derived(entry.locked && !entry.isViewer);

  const rankLabel = $derived.by(() => {
    if (entry.rank != null) {
      return `#${entry.rank}`;
    }
    return isLockedFollow ? `#${(entry.user.id % 400) + 50}` : null;
  });

  // Top-3 podium flair (ranked entries only, not the blurred free placeholders).
  const medalRank = $derived(
    !isLockedFollow && entry.rank != null && entry.rank <= 3
      ? entry.rank
      : null,
  );

  const stats = $derived.by(() => {
    if (isLockedFollow) {
      const plays = (entry.user.id % 5000) + 500;
      return [
        toStatLabel(plays, "plays", locale),
        toStatLabel(Math.round(plays * 0.7), "hours", locale),
      ].join(" · ");
    }

    if (entry.totalPlays == null && entry.totalMinutes == null) {
      return null;
    }

    const parts: string[] = [];
    if (entry.totalPlays != null) {
      parts.push(toStatLabel(entry.totalPlays, "plays", locale));
    }
    if (entry.totalMinutes != null) {
      parts.push(toStatLabel(Math.round(entry.totalMinutes / 60), "hours", locale));
    }
    return parts.join(" · ");
  });
</script>

<div
  class="trakt-leaderboard-item"
  class:is-viewer={entry.isViewer}
  class:is-free={isLockedFollow}
>
  <div class="item-grid">
    <div
      class="item-rank"
      class:is-blurred={isLockedFollow}
      data-medal={medalRank}
    >
      {#if rankLabel}
        <span class="rank-badge bold">{rankLabel}</span>
      {:else}
        <span class="secondary">—</span>
      {/if}
    </div>

    <UserAvatar user={entry.user} />

    <div class="item-copy">
      <div class="copy-heading">
        <Link href={profileHref} color="inherit">
          <p class="trakt-card-title ellipsis bold">{displayName}</p>
        </Link>

        {#if entry.isViewer}
          <span class="you-chip bold">{m.text_leaderboard_you()}</span>
        {/if}
      </div>

      {#if stats}
        <div class="item-tags">
          <span class="item-stats" class:is-blurred={isLockedFollow}>
            <StemTag>
              <p class="bold tag no-wrap">{stats}</p>
            </StemTag>
          </span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-leaderboard-item {
    padding: var(--gap-xs) var(--gap-s);
    border-radius: var(--border-radius-m);

    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    &.is-viewer {
      background: color-mix(in srgb, var(--purple-500) 12%, transparent);
      border: var(--ni-1) solid
        color-mix(in srgb, var(--purple-500) 45%, transparent);
    }

    // Free members read as a lesser tier: flat, dimmed, desaturated avatar.
    &.is-free {
      background: none;
      opacity: 0.55;

      .item-copy :global(p) {
        color: var(--color-text-secondary);
      }

      :global(.trakt-user-avatar img) {
        filter: grayscale(1);
        border-color: var(--color-border);
      }
    }

    :global(.trakt-link) {
      text-decoration: none;
      min-width: 0;
    }
  }

  .item-grid {
    display: grid;
    grid-template-columns: auto var(--ni-44) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .item-rank {
    min-width: var(--ni-28);
    text-align: center;
    font-variant-numeric: tabular-nums;

    &[data-medal="1"] {
      --medal-color: var(--color-medal-gold);
    }
    &[data-medal="2"] {
      --medal-color: var(--color-medal-silver);
    }
    &[data-medal="3"] {
      --medal-color: var(--color-medal-bronze);
    }

    &[data-medal] .rank-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: var(--ni-28);
      padding: var(--ni-2) var(--ni-8);
      box-sizing: border-box;

      border-radius: var(--border-radius-xxl);
      color: var(--medal-color);

      @include flair-chip(var(--medal-color));
    }
  }

  // Extra flair when the podium spot is ours: solid medal fill + glow.
  .trakt-leaderboard-item.is-viewer .item-rank[data-medal] .rank-badge {
    color: var(--shade-950);
    background: var(--medal-color);
    border-color: var(--medal-color);
    box-shadow: 0 0 var(--ni-12)
      color-mix(in srgb, var(--medal-color) 55%, transparent);
  }

  .item-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }

  .copy-heading {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    min-width: 0;
  }

  .you-chip {
    flex: 0 0 auto;

    padding: 0 var(--ni-6);
    border-radius: var(--border-radius-xxl);

    background: color-mix(in srgb, var(--purple-500) 35%, transparent);
    color: var(--color-text-primary);
    font-size: var(--font-size-tag);
  }

  .item-tags {
    display: flex;
    align-items: center;
    gap: var(--ni-4);
    flex-wrap: wrap;
  }

  .item-stats :global(.trakt-stem-tag p) {
    font-size: var(--font-size-text-small);
  }

  .is-blurred {
    filter: blur(var(--ni-4));
    user-select: none;
    pointer-events: none;
  }
</style>
