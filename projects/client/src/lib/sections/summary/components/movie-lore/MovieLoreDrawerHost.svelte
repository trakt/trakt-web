<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import { TAB_PARAM } from "$lib/sections/summary/constants.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { onMount } from "svelte";
  import RecapHero from "../recap/_internal/RecapHero.svelte";
  import { toRecapDuration } from "../recap/toRecapDuration.ts";
  import MovieLoreLocked from "./_internal/MovieLoreLocked.svelte";
  import MovieLoreLoreTab from "./_internal/MovieLoreLoreTab.svelte";
  import MovieLoreProgress from "./_internal/MovieLoreProgress.svelte";
  import MovieLoreSetupTab from "./_internal/MovieLoreSetupTab.svelte";
  import MovieLoreSkeleton from "./_internal/MovieLoreSkeleton.svelte";
  import { toLoreHeroLabel } from "./_internal/toLoreHeroLabel.ts";
  import { toLoreProgress } from "./_internal/toLoreProgress.ts";
  import { useMovieLore } from "./useMovieLore.ts";
  import { useWatchedMovieIds } from "./useWatchedMovieIds.ts";

  const SETUP_TAB = "setup" as const;
  const LORE_TAB = "lore" as const;

  const { movie, onClose }: {
    movie: MovieEntry;
    onClose: () => void;
  } = $props();

  const { track: trackOpen } = useTrack(AnalyticsEvent.MovieLoreOpen);
  const { track: trackTab } = useTrack(AnalyticsEvent.MovieLoreTab);
  const { track: trackReveal } = useTrack(AnalyticsEvent.MovieLoreReveal);

  onMount(() => trackOpen());

  function toTab(value: string | null) {
    return value === LORE_TAB ? LORE_TAB : SETUP_TAB;
  }

  function onTabChange(value: string) {
    const tab = toTab(value);
    activeTab = tab;
    trackTab({ tab });

    const url = new URL(page.url);
    url.searchParams.set(TAB_PARAM, tab);
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- same page URL, only the tab param changes
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  const { lore, isVip: isVipStore } = useMovieLore(
    fromRune(() => ({ slug: movie.slug })),
  );
  const isVip = $derived($isVipStore);

  const watchedIdsStore = useWatchedMovieIds();
  const watchedIds = $derived($watchedIdsStore ?? new Set<number>());

  let activeTab = $state(toTab(page.url.searchParams.get(TAB_PARAM)));

  const progress = $derived(
    $lore && toLoreProgress({ earlier: $lore.earlier, watchedIds }),
  );

  const duration = $derived(
    $lore
      ? toRecapDuration([
          ...$lore.setup,
          $lore.watchFirst?.note ?? "",
          ...$lore.lore,
          ...$lore.previously.map(({ summary }) => summary),
        ])
      : undefined,
  );
</script>

{#snippet setupView()}
  <div class="lore-panel">
    {#if $lore}
      <MovieLoreSetupTab lore={$lore} {watchedIds} />
    {/if}
  </div>
{/snippet}

{#snippet loreView()}
  <div class="lore-panel">
    {#if $lore}
      <MovieLoreLoreTab
        lore={$lore}
        {movie}
        {watchedIds}
        onReveal={() => trackReveal()}
      />
    {/if}
  </div>
{/snippet}

{#snippet lockedView()}
  <div class="lore-panel">
    {#if $lore}
      <MovieLoreLocked
        locked={$lore.locked}
        hasEarlier={$lore.earlier.length > 0}
      />
    {/if}
  </div>
{/snippet}

{#snippet lockedIcon()}
  <LockIcon />
{/snippet}

{#if $lore !== null}
  <Drawer
    {onClose}
    variant={isVip ? "vip" : "default"}
    headerVariant="overlay"
    size="large"
  >
    <div
      class="trakt-movie-lore"
      data-audience={isVip ? "vip" : "standard"}
    >
      <RecapHero
        image={movie.cover.url.medium}
        heading={m.header_movie_lore({ title: movie.title })}
        label={$lore ? toLoreHeroLabel($lore) : undefined}
        note={m.text_movie_lore_no_spoilers()}
        {duration}
      />

      <div class="lore-body">
        {#if $lore && progress && progress.totalCount > 0}
          <RenderFor audience="authenticated">
            <MovieLoreProgress
              {progress}
              verdict={$lore.watchFirst?.verdict}
              title={movie.title}
            />
          </RenderFor>
        {/if}

        {#if $lore}
          {@const current = $lore}
          <div class="lore-tabs">
            <TabView
              value={activeTab}
              onChange={onTabChange}
              tabs={[
                {
                  value: SETUP_TAB,
                  label: m.tab_text_movie_lore_setup(),
                  content: setupView,
                },
                {
                  value: LORE_TAB,
                  label: m.tab_text_movie_lore_lore(),
                  content: current.locked === null ? loreView : lockedView,
                  icon: isVip ? undefined : lockedIcon,
                },
              ]}
            />
          </div>
        {:else}
          <MovieLoreSkeleton />
        {/if}
      </div>
    </div>
  </Drawer>
{/if}

<style lang="scss">
  .trakt-movie-lore {
    --recap-card-background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-text-primary) 6%, var(--color-card-background)),
      color-mix(in srgb, var(--color-text-primary) 2%, var(--color-card-background))
    );
    --recap-card-ring: color-mix(
      in srgb,
      var(--color-text-primary) 8%,
      transparent
    );

    display: flex;
    flex-direction: column;

    &[data-audience="vip"] {
      --recap-card-background: var(--background-vip-card);
      --recap-card-ring: color-mix(
        in srgb,
        var(--color-vip-border-accent) 22%,
        transparent
      );
    }

    .lore-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);
      padding-block: var(--gap-m) var(--gap-xl);
    }

    .lore-tabs :global(.lore-panel) {
      margin-inline: calc(-1 * var(--ni-8));
    }
  }
</style>
