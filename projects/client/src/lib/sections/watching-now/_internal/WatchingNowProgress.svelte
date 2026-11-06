<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem.ts";
  import { toPlaybackClock } from "./toPlaybackClock.ts";
  import { toWatchingProgress } from "./toWatchingProgress.ts";
  import { useWatchingClock } from "./useWatchingClock.ts";

  const { nowPlaying }: { nowPlaying: NowPlayingItem } = $props();

  const clock = useWatchingClock();

  const progress = $derived(
    toWatchingProgress({
      startedAt: nowPlaying.startedAt,
      expiresAt: nowPlaying.expiresAt,
      now: $clock,
    }),
  );

  const color = $derived(
    nowPlaying.action === "checkin"
      ? "var(--color-background-purple)"
      : "var(--color-background-red)",
  );
</script>

<div class="trakt-watching-now-progress">
  <DistributionBar
    fraction={progress.fraction}
    {color}
    animated={false}
    --distribution-bar-track="var(--color-watching-now-progress-track)"
  />
  <div class="progress-meta">
    <span class="tag bold">{toPlaybackClock(progress.elapsed)}</span>
    <span class="tag bold secondary">
      -{toPlaybackClock(progress.remaining)}
    </span>
  </div>
</div>

<style lang="scss">
  .trakt-watching-now-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;

    .progress-meta {
      display: flex;
      justify-content: space-between;
      gap: var(--gap-s);
      font-variant-numeric: tabular-nums;
    }
  }
</style>
