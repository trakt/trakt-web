<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import LiveDot from "$lib/components/live-dot/LiveDot.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem.ts";
  import { toWatchingTitles } from "./_internal/toWatchingTitles.ts";
  import WatchingNowCover from "./_internal/WatchingNowCover.svelte";
  import WatchingNowProgress from "./_internal/WatchingNowProgress.svelte";

  const { nowPlaying }: { nowPlaying: NowPlayingItem } = $props();

  const { track } = useTrack(AnalyticsEvent.WatchingNowOpen);

  const titles = $derived(toWatchingTitles(nowPlaying));
</script>

<div class="trakt-watching-now-profile-panel">
  <Link
    href={titles.href}
    color="inherit"
    onclick={() => track({ source: "profile" })}
  >
    <div class="panel-backdrop">
      <WatchingNowCover {nowPlaying} />
    </div>

    <div class="panel-content">
      <span class="panel-label small bold">
        <LiveDot color={nowPlaying.action === "checkin" ? "purple" : "red"} />
        {m.header_watching_now()}
      </span>
      <span class="title ellipsis">{titles.title}</span>
      {#if titles.subtitle}
        <span class="small secondary ellipsis">{titles.subtitle}</span>
      {/if}
      <WatchingNowProgress {nowPlaying} />
    </div>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-watching-now-profile-panel {
    width: 100%;
    height: 100%;
    min-height: var(--ni-136);

    :global(.trakt-link) {
      position: relative;
      isolation: isolate;
      overflow: hidden;

      display: flex;
      align-items: flex-end;

      height: 100%;
      box-sizing: border-box;

      border-radius: var(--border-radius-m);
      color: var(--color-text-primary);
      text-decoration: none;
    }

    .panel-backdrop {
      position: absolute;
      inset: 0;
      z-index: -1;

      transition: transform var(--transition-increment) ease-out;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          0deg,
          color-mix(in srgb, var(--color-background) 92%, transparent) 30%,
          color-mix(in srgb, var(--color-background) 20%, transparent)
        );
      }
    }

    @include for-mouse {
      &:hover .panel-backdrop {
        transform: scale(1.03);
      }
    }

    .panel-content {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);

      width: 100%;
      min-width: 0;
      padding: var(--ni-16);
    }

    .panel-label {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }
  }
</style>
