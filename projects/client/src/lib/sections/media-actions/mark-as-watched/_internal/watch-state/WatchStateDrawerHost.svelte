<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { showProgressQuery } from "$lib/requests/queries/shows/showProgressQuery.ts";
  import { showSeasonsQuery } from "$lib/requests/queries/shows/showSeasonsQuery.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import { getShowWatchState } from "$lib/utils/media/getShowWatchState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { distinctUntilChanged, map } from "rxjs";
  import { onMount } from "svelte";
  import { markAsWatchedDrawerStore } from "../markAsWatchedDrawerStore.ts";
  import {
    useMarkAsWatched,
    type MarkAsWatchedStoreProps,
  } from "../../useMarkAsWatched.ts";
  import SeasonWatchRow from "./SeasonWatchRow.svelte";
  import { toSeasonWatchStates } from "./toSeasonWatchStates.ts";
  import WatchProgressLine from "./WatchProgressLine.svelte";
  import type { WatchStateShow } from "./WatchStateShow.ts";

  const {
    onClose,
    title,
    show,
    mediaStore,
  }: {
    onClose: () => void;
    title: string;
    show: WatchStateShow;
    mediaStore: MarkAsWatchedStoreProps;
  } = $props();

  const { history } = useUser();
  const { confirm } = useConfirm();
  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  const SKELETON_SEASON_COUNT = 4;

  const slug$ = fromRune(() => show.slug).pipe(distinctUntilChanged());
  const seasonsQuery = useQuery(
    slug$.pipe(map((slug) => showSeasonsQuery({ slug }))),
  );
  const progressQuery = useQuery(
    slug$.pipe(map((slug) => showProgressQuery({ slug }))),
  );
  const { isWatched, isMarkingAsWatched, removeWatched } = $derived(
    useMarkAsWatched(mediaStore),
  );

  const watchedShow = $derived($history?.shows.get(show.id));
  const seasonStates = $derived(
    toSeasonWatchStates({
      seasons: $seasonsQuery.data ?? [],
      watchedShow,
    }),
  );

  const { watchedEpisodeCount } = $derived(
    getShowWatchState({ watchedShow, episodeCount: show.episode.count }),
  );
  const watched = $derived(Math.min(watchedEpisodeCount, show.episode.count));
  const fraction = $derived(
    show.episode.count === 0 ? 0 : watched / show.episode.count,
  );
  const episodeShow = $derived({ id: show.id, title });

  const upNext = $derived.by(() => {
    const next = $progressQuery.data;
    if (!next || next.id === -1 || next.remaining <= 0) return null;

    return next;
  });

  const firstUnfinishedSeason = $derived(
    seasonStates.find(
      (season) => season.number !== 0 && season.aired > 0 && !season.isComplete,
    )?.number,
  );
  const currentSeason = $derived(upNext?.season ?? firstUnfinishedSeason);

  let expandedOverrides = $state<ReadonlyMap<number, boolean>>(new Map());
  let hasUserScrolled = false;

  const scrollToSeason = (season: number | Nil) => (list: HTMLElement) => {
    if (hasUserScrolled || season == null) return;

    const row = list.querySelector<HTMLElement>(`[data-season="${season}"]`);
    if (!row) return;

    const pin = () => {
      const fade = Number.parseFloat(getComputedStyle(list).paddingTop);
      const offset =
        row.getBoundingClientRect().top - list.getBoundingClientRect().top;

      list.scrollTo({ top: list.scrollTop + offset - fade });
    };

    const observer = new ResizeObserver(pin);
    const release = () => {
      hasUserScrolled = true;
      observer.disconnect();
    };

    observer.observe(list);
    [...list.children].forEach((child) => observer.observe(child));

    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach((event) =>
      list.addEventListener(event, release, { passive: true, once: true }),
    );

    return () => {
      observer.disconnect();
      events.forEach((event) => list.removeEventListener(event, release));
    };
  };

  const isExpanded = (season: number) =>
    expandedOverrides.get(season) ?? season === currentSeason;

  const toggleSeason = (season: number) => {
    const next = !isExpanded(season);
    expandedOverrides = new Map(expandedOverrides).set(season, next);

    if (next) {
      track({ source: "watch-state", type: "season" });
    }
  };

  const markShowAsWatched = () => {
    onClose();
    markAsWatchedDrawerStore.open({ title, mediaStore });
  };

  const confirmRemoveWatched = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatched,
      title,
      onConfirm: removeWatched,
    }),
  );

  onMount(() => track({ source: "watch-state", type: "show" }));
</script>

{#snippet background()}
  <div
    class="watch-state-aurora"
    style:--aurora-primary={show.colors?.at(0)}
    style:--aurora-secondary={show.colors?.at(1)}
  >
    <span class="aurora-glow aurora-glow-primary"></span>
    <span class="aurora-glow aurora-glow-secondary"></span>
  </div>
{/snippet}

{#snippet footer()}
  <div class="watch-state-footer">
    {#if $isWatched}
      <Button
        label={m.button_label_remove_from_watched({ title })}
        color="red"
        variant="secondary"
        disabled={$isMarkingAsWatched}
        onclick={confirmRemoveWatched}
      >
        {m.button_text_remove_from_history()}
      </Button>
    {:else}
      <Button
        label={m.button_label_mark_as_watched({ title })}
        color="purple"
        disabled={$isMarkingAsWatched}
        onclick={markShowAsWatched}
      >
        {m.button_text_mark_as_watched()}
        {#snippet icon()}
          <TrackIcon state="unwatched" />
        {/snippet}
      </Button>
    {/if}
  </div>
{/snippet}

<Drawer
  {onClose}
  {title}
  {footer}
  {background}
  footerDivider="fading"
  size="medium"
>
  <div class="trakt-watch-state-drawer">
    <section class="watch-state-hero">
      <div class="hero-summary">
        <p class="hero-percentage">
          {toPercentage(fraction, languageTag())}
        </p>
        <p class="hero-count">
          <span class="bold">
            {m.text_watch_state_fraction({
              watched,
              total: show.episode.count,
            })}
          </span>
          <span class="secondary">{m.text_watch_state_episodes()}</span>
        </p>
      </div>

      <WatchProgressLine progress={fraction * 100} tone="lit" size="large" />
    </section>

    {#if seasonStates.length === 0 && !$seasonsQuery.isFetched}
      <section class="watch-state-seasons" aria-busy="true">
        {#each { length: SKELETON_SEASON_COUNT }, index (index)}
          <div class="season-skeleton">
            <span class="skeleton-lines">
              <span class="skeleton-title"></span>
              <span class="skeleton-bar"></span>
            </span>
          </div>
        {/each}
      </section>
    {:else}
      <section
        class="watch-state-seasons"
        {@attach scrollToSeason(currentSeason)}
      >
        {#each seasonStates as season (season.number)}
          <SeasonWatchRow
            state={season}
            showSlug={show.slug}
            show={episodeShow}
            upNextEpisodeId={upNext?.id}
            isExpanded={isExpanded(season.number)}
            onToggle={() => toggleSeason(season.number)}
          />
        {/each}
      </section>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .watch-state-aurora {
    --aurora-fallback: var(--purple-500);

    position: absolute;
    inset: 0;
  }

  .aurora-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(var(--ni-32));
  }

  .aurora-glow-primary {
    top: calc(-1 * var(--ni-128));
    inset-inline-start: calc(-1 * var(--ni-64));
    width: calc(var(--ni-320) + var(--ni-40));
    height: calc(var(--ni-320) + var(--ni-40));

    background: radial-gradient(
      circle,
      oklch(
        from var(--aurora-primary, var(--aurora-fallback))
          var(--watch-state-aurora-lightness)
          min(c, var(--watch-state-aurora-chroma)) h /
          var(--watch-state-aurora-alpha)
      ),
      transparent 65%
    );
  }

  .aurora-glow-secondary {
    top: calc(-1 * var(--ni-72));
    inset-inline-end: calc(-1 * var(--ni-128));
    width: var(--ni-320);
    height: var(--ni-320);

    opacity: 0.7;
    background: radial-gradient(
      circle,
      oklch(
        from var(--aurora-secondary, var(--aurora-fallback))
          var(--watch-state-aurora-lightness)
          min(c, var(--watch-state-aurora-chroma)) h /
          var(--watch-state-aurora-alpha)
      ),
      transparent 65%
    );
  }

  .trakt-watch-state-drawer {
    flex: 1;
    min-height: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .watch-state-hero {
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .hero-summary {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .hero-percentage {
    font-size: var(--ni-72);

    @include for-mobile {
      font-size: var(--ni-48);
    }
    font-weight: 200;
    line-height: 0.8;
    letter-spacing: -0.05em;
    font-variant-numeric: tabular-nums;

    background: linear-gradient(
      180deg,
      var(--color-text-primary),
      color-mix(in srgb, var(--color-text-primary) 60%, transparent)
    );
    background-clip: text;
    color: transparent;
  }

  .hero-count {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    font-variant-numeric: tabular-nums;

    .secondary {
      font-size: var(--font-size-text-small);
      color: var(--color-text-secondary);
    }
  }

  .watch-state-seasons {
    --seasons-fade: var(--gap-m);

    flex: 1;
    min-height: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin-inline: calc(-1 * var(--ni-4));
    padding: var(--seasons-fade) var(--ni-4) var(--ni-8);

    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;

    mask-image: linear-gradient(
      to bottom,
      transparent,
      black var(--seasons-fade),
      black calc(100% - var(--seasons-fade)),
      transparent
    );
  }

  .season-skeleton {
    padding: var(--ni-12);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    border-radius: var(--border-radius-l);
    background-color: var(--color-watch-state-quiet);

    animation: watch-state-skeleton-pulse calc(8 * var(--transition-increment))
      ease-in-out infinite alternate;
  }

  .skeleton-title,
  .skeleton-bar {
    display: block;
    background-color: var(--color-watch-state-track);
  }

  .skeleton-lines {
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .skeleton-title {
    width: var(--ni-80);
    height: var(--ni-14);
    border-radius: var(--border-radius-xs);
  }

  .skeleton-bar {
    height: var(--ni-6);
    border-radius: var(--border-radius-pill);
  }

  @keyframes watch-state-skeleton-pulse {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .season-skeleton {
      animation: none;
    }
  }

  .watch-state-footer {
    display: grid;
  }
</style>
