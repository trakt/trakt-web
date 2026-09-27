<script lang="ts" module>
  const MAX_PINGS_PER_BURST = 3;
  const PING_BURST_WINDOW = 10_000;
  const PING_STAGGER = 400;
  const RING_COUNT = 3;
  const SEEN_DURATION = 600;

  let burst = { startedAt: 0, count: 0 };

  const isBurstOver = (now: number) =>
    now - burst.startedAt > PING_BURST_WINDOW;

  const hasFreeSlot = (now: number) =>
    isBurstOver(now) || burst.count < MAX_PINGS_PER_BURST;

  function takePingSlot(now: number): number {
    if (isBurstOver(now)) burst = { startedAt: now, count: 0 };

    const slot = burst.count;
    burst = { ...burst, count: slot + 1 };
    return slot;
  }
</script>

<script lang="ts">
  import type { TagType } from "$lib/components/media/tags/models/TagType";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { type EpisodeType } from "$lib/requests/models/EpisodeType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { claimNewReleasePing } from "../_internal/claimNewReleasePing.ts";
  import { whenSeenFor } from "../_internal/whenSeenFor.ts";
  import type { CoalescedEpisodes } from "../CoalescedEpisodes";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import type { EpisodeStatus } from "../EpisodeStatus";
  import { getEpisodeStatus } from "../getEpisodeStatus";

  type EpisodeStatusProps = {
    i18n: EpisodeIntl;
    episodeType: EpisodeType;
    type?: TagType;
    isLatestAired?: boolean;
    releaseDate?: Date;
    episodes?: CoalescedEpisodes;
    announceKey?: string;
  };

  const {
    i18n,
    episodeType,
    type = "text",
    isLatestAired,
    releaseDate,
    episodes,
    announceKey,
  }: EpisodeStatusProps = $props();

  const status = $derived(
    getEpisodeStatus(episodeType, { isLatestAired, releaseDate, episodes }),
  );

  const labels: Record<EpisodeStatus, () => string> = $derived({
    "new": i18n.newText,
    "premiere": i18n.premiereText,
    "finale": i18n.finaleText,
    "new-premiere": announceKey ? i18n.premiereText : i18n.newPremiereText,
    "new-finale": announceKey ? i18n.finaleText : i18n.newFinaleText,
  });

  const isNew = $derived(
    status === "new" || status === "new-premiere" || status === "new-finale",
  );

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  let pingDelay: number | null = $state(null);

  function announce() {
    if (!announceKey || !isNew || $isReducedMotion) return;

    const now = Date.now();
    if (!hasFreeSlot(now)) return;
    if (
      !claimNewReleasePing({ key: announceKey, storage: safeLocalStorage, now })
    ) return;

    pingDelay = takePingSlot(now) * PING_STAGGER;
  }
</script>

{#snippet tagContent(episodeStatus: EpisodeStatus)}
  <div class="trakt-episode-status">
    <div
      class="trakt-episode-status-indicator"
      data-status={episodeStatus}
      use:whenSeenFor={{ callback: announce, duration: SEEN_DURATION }}
    >
      {#if pingDelay !== null}
        {#each { length: RING_COUNT } as _, ring (ring)}
          <span
            class="status-ping"
            style="--ring-delay: {pingDelay + ring * 350}ms"
            aria-hidden="true"
          ></span>
        {/each}
      {/if}
    </div>
    <p class="bold capitalize ellipsis">
      {labels[episodeStatus]()}
    </p>
  </div>
{/snippet}

{#if status}
  {#if type === "text"}
    <TextTag>
      {@render tagContent(status)}
    </TextTag>
  {:else}
    <StemTag>
      {@render tagContent(status)}
    </StemTag>
  {/if}
{/if}

<style>
  .trakt-episode-status {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    min-width: 0;
  }

  .trakt-episode-status-indicator {
    --indicator-size: var(--ni-6);

    position: relative;
    flex-shrink: 0;
    width: var(--indicator-size);
    height: var(--indicator-size);
    border-radius: 50%;
    background-color: var(--status-color);

    &[data-status="finale"],
    &[data-status="new-finale"] {
      --status-color: var(--red-500);
    }

    &[data-status="premiere"],
    &[data-status="new-premiere"] {
      --status-color: var(--green-500);
    }

    &[data-status="new"] {
      --status-color: var(--blue-500);
    }
  }

  .status-ping {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: var(--status-color);
    pointer-events: none;
    animation: status-ping 1200ms var(--ring-delay) ease-out both;
  }

  @keyframes status-ping {
    from {
      opacity: 0.55;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(3.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .status-ping {
      display: none;
    }
  }
</style>
