<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { TAB_PARAM } from "$lib/sections/summary/constants.ts";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { onMount } from "svelte";
  import RecapHero from "./_internal/RecapHero.svelte";
  import RecapSkeleton from "./_internal/RecapSkeleton.svelte";
  import RecapSpoilerGuard from "./_internal/RecapSpoilerGuard.svelte";
  import RecapStory from "./_internal/RecapStory.svelte";
  import RecapStoryLocked from "./_internal/RecapStoryLocked.svelte";
  import RecapTab from "./_internal/RecapTab.svelte";
  import { toRecapDuration } from "./toRecapDuration.ts";
  import { useRecapSpoilerGuard } from "./useRecapSpoilerGuard.ts";
  import { useSeasonRecap } from "./useSeasonRecap.ts";
  import { useShowRecapStory } from "./useShowRecapStory.ts";

  const RECAP_TAB = "recap" as const;
  const STORY_TAB = "story" as const;

  const { show, seasons, season, onClose }: {
    show: ShowEntry;
    seasons: ReadonlyArray<Season>;
    season: number;
    onClose: () => void;
  } = $props();

  const { track: trackOpen } = useTrack(AnalyticsEvent.RecapOpen);
  const { track: trackTab } = useTrack(AnalyticsEvent.RecapTab);
  const { track: trackReveal } = useTrack(AnalyticsEvent.RecapReveal);

  onMount(() => trackOpen());

  function onReveal() {
    isRevealed = true;
    trackReveal();
  }

  function toTab(value: string | null) {
    return value === STORY_TAB ? STORY_TAB : RECAP_TAB;
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

  const { recap, isVip: isVipStore } = useSeasonRecap(
    fromRune(() => ({ slug: show.slug, season })),
  );
  const isVip = $derived($isVipStore);
  const { story } = useShowRecapStory(
    fromRune(() => ({
      slug: show.slug,
      through: season,
      enabled: $recap?.hasStory === true,
    })),
  );

  const seasonEntry = $derived(seasons.find(({ number }) => number === season));
  const guard = $derived(
    seasonEntry ? useRecapSpoilerGuard({ show, season: seasonEntry }) : undefined,
  );
  const isSpoilerHidden = $derived(guard?.isSpoilerHidden);
  const watched = $derived(guard?.watched);

  let isRevealed = $state(false);
  let activeTab = $state(toTab(page.url.searchParams.get(TAB_PARAM)));

  const isGuarded = $derived($isSpoilerHidden !== false && !isRevealed);

  const hasStoryTab = $derived(
    isVip && $recap?.hasStory === true && $story !== null,
  );
  const hasTabs = $derived(!isVip || hasStoryTab);
  const isLoading = $derived($recap === undefined);
  const expectsTabs = $derived(
    !isVip || $recap === undefined || $recap?.hasStory === true,
  );
  const shownTab = $derived(
    activeTab === STORY_TAB && hasTabs ? STORY_TAB : RECAP_TAB,
  );

  const duration = $derived(
    $recap
      ? toRecapDuration([
          $recap.summary,
          ...$recap.keyPoints,
          ...$recap.lines.map(({ text }) => text),
        ])
      : undefined,
  );
</script>

{#snippet recapView()}
  <div class="recap-panel">
    {#if $recap}
      <RecapTab recap={$recap} />
    {/if}
  </div>
{/snippet}

{#snippet storyView()}
  <div class="recap-panel">
    {#if !isVip}
      <RecapStoryLocked />
    {:else if $story}
      <RecapStory story={$story} {seasons} />
    {:else}
      <RecapSkeleton />
    {/if}
  </div>
{/snippet}

{#snippet lockedIcon()}
  <LockIcon />
{/snippet}

{#if $recap !== null}
  <Drawer
    {onClose}
    variant={isVip ? "vip" : "default"}
    headerVariant="overlay"
    size="large"
  >
    <div
      class="trakt-season-recap"
      data-audience={isVip ? "vip" : "standard"}
    >
      <RecapHero
        image={show.cover.url.medium}
        title={show.title}
        season={season}
        episodeCount={seasonEntry?.episodes.count ?? 0}
        {duration}
      />

      <div class="recap-body">
        <RecapSpoilerGuard
          {isGuarded}
          {season}
          watched={$watched ?? 0}
          total={seasonEntry?.episodes.aired ?? 0}
          {onReveal}
        >
          {#if isLoading}
            <RecapSkeleton hasTabs={expectsTabs} />
          {:else if hasTabs}
            <div class="recap-tabs">
              <TabView
                value={shownTab}
                onChange={onTabChange}
                tabs={[
                  { value: RECAP_TAB, label: m.tab_text_season_recap(), content: recapView },
                  {
                    value: STORY_TAB,
                    label: m.tab_text_recap_story(),
                    content: storyView,
                    icon: isVip ? undefined : lockedIcon,
                  },
                ]}
              />
            </div>
          {:else}
            {@render recapView()}
          {/if}
        </RecapSpoilerGuard>
      </div>
    </div>
  </Drawer>
{/if}

<style lang="scss">
  .trakt-season-recap {
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
      --recap-face-ring: color-mix(
        in srgb,
        var(--color-vip-border-accent) 45%,
        transparent
      );
    }

    .recap-body {
      padding-block: var(--gap-m) var(--gap-xl);
    }

    .recap-tabs :global(.recap-panel) {
      margin-inline: calc(-1 * var(--ni-8));
    }
  }
</style>
