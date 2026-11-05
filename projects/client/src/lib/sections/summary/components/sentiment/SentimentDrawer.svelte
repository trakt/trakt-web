<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import { TAB_PARAM } from "$lib/sections/summary/constants.ts";
  import { fade } from "svelte/transition";
  import RealityCheckTab from "../reality-check/RealityCheckTab.svelte";
  import type { InsightsOpenSource } from "./models/InsightsOpenSource.ts";
  import type { InsightsTab } from "./models/InsightsTab.ts";
  import MatchTab from "./_internal/MatchTab.svelte";
  import SentimentContent from "./_internal/SentimentContent.svelte";
  import SentimentContentSkeleton from "./_internal/SentimentContentSkeleton.svelte";
  import SentimentUpsell from "./_internal/SentimentUpsell.svelte";
  import { useMatch } from "./useMatch.ts";

  const REALITY_CHECK_TAB: InsightsTab = "reality-check";
  const SENTIMENT_TAB: InsightsTab = "sentiment";
  const MATCH_TAB: InsightsTab = "match";

  const {
    onClose,
    sentiment,
    realityCheck,
    source,
    type,
    id,
  }: {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheck | null | undefined;
    type: MediaType;
    id: number;
    source: InsightsOpenSource;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
  let activeTab = $state(toTab(page.url.searchParams.get(TAB_PARAM)));

  const { match, taste, isLoading: isMatchLoading } = useMatch(fromRune(() => ({ type, id })));

  const { track: trackOpen } = useTrack(AnalyticsEvent.InsightsOpen);
  const { track: trackTab } = useTrack(AnalyticsEvent.InsightsTab);

  function toTab(value: string | null): InsightsTab {
    if (value === SENTIMENT_TAB || value === MATCH_TAB) return value;
    return REALITY_CHECK_TAB;
  }

  function onTabChange(to: string) {
    const tab = toTab(to);
    activeTab = tab;
    trackTab({ tab });

    const url = new URL(page.url);
    url.searchParams.set(TAB_PARAM, to);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  const tabs = $derived(
    [
      sentiment !== null && {
        value: SENTIMENT_TAB,
        label: m.header_community_sentiment(),
        content: sentimentView,
      },
      realityCheck !== null && {
        value: REALITY_CHECK_TAB,
        label: m.header_reality_check(),
        content: realityCheckView,
      },
      $match !== null && {
        value: MATCH_TAB,
        label: m.header_match(),
        content: matchView,
      },
    ].filter((tab) => tab !== false),
  );

  const hasTabs = $derived(tabs.length > 1);

  const shownTab = $derived(
    tabs.find((tab) => tab.value === activeTab)?.value ??
      tabs.at(0)?.value ??
      REALITY_CHECK_TAB,
  );

  let hasTrackedOpen = false;

  $effect(() => {
    if (hasTrackedOpen) return;
    if (activeTab === MATCH_TAB && $isMatchLoading) return;
    hasTrackedOpen = true;
    trackOpen({ source, tab: shownTab });
  });
</script>

{#snippet sentimentView()}
  {#if sentiment !== null}
    <RenderFor audience="vip">
      {#if sentiment}
        <SentimentContent {sentiment} />
      {:else}
        <SentimentContentSkeleton />
      {/if}
    </RenderFor>

    <RenderFor audience="free">
      <SentimentUpsell />
    </RenderFor>
  {/if}
{/snippet}

{#snippet realityCheckView()}
  <RealityCheckTab realityCheck={realityCheck ?? undefined} />
{/snippet}

{#snippet matchView()}
  {#if $match !== null}
    <MatchTab score={$match} taste={$taste} {type} {id} />
  {/if}
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_insights()}
  variant="vip"
  size="auto"
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      {#if hasTabs}
        <TabView
          value={shownTab}
          onChange={onTabChange}
          {tabs}
        />
      {:else if shownTab === SENTIMENT_TAB}
        {@render sentimentView()}
      {:else if shownTab === MATCH_TAB}
        {@render matchView()}
      {:else}
        {@render realityCheckView()}
      {/if}
    </div>
  {/if}
</Drawer>
