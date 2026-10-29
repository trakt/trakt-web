<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import { TAB_PARAM } from "$lib/sections/summary/constants.ts";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import SummaryHeaderStatePill from "../header-kit/SummaryHeaderStatePill.svelte";
  import { toSummarySentiment } from "../header-kit/toSummarySentiment.ts";
  import RealityCheckTab from "../reality-check/RealityCheckTab.svelte";
  import { useIsRevampedSummaryHeader } from "../media/header/useIsRevampedSummaryHeader.ts";
  import type { InsightsOpenSource } from "./models/InsightsOpenSource.ts";
  import type { InsightsTab } from "./models/InsightsTab.ts";
  import SentimentBands from "./_internal/SentimentBands.svelte";
  import SentimentContent from "./_internal/SentimentContent.svelte";
  import SentimentContentSkeleton from "./_internal/SentimentContentSkeleton.svelte";
  import SentimentUpsell from "./_internal/SentimentUpsell.svelte";

  const REALITY_CHECK_TAB: InsightsTab = "reality-check";
  const SENTIMENT_TAB: InsightsTab = "sentiment";

  const {
    onClose,
    sentiment,
    realityCheck,
    source,
  }: {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheck | null | undefined;
    source: InsightsOpenSource;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);

  /* Behind the revamped headers, the drawer speaks their language too. */
  const isRevampedHeader = useIsRevampedSummaryHeader();
  let activeTab = $state(
    page.url.searchParams.get(TAB_PARAM) === SENTIMENT_TAB
      ? SENTIMENT_TAB
      : REALITY_CHECK_TAB,
  );

  const { track: trackOpen } = useTrack(AnalyticsEvent.InsightsOpen);
  const { track: trackTab } = useTrack(AnalyticsEvent.InsightsTab);

  function toTab(value: string): InsightsTab {
    return value === SENTIMENT_TAB ? SENTIMENT_TAB : REALITY_CHECK_TAB;
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

  const hasTabs = $derived(sentiment !== null && realityCheck !== null);

  const shownTab = $derived.by(() => {
    if (hasTabs) return activeTab;
    return sentiment !== null ? SENTIMENT_TAB : REALITY_CHECK_TAB;
  });

  const verdict = $derived(toSummarySentiment(sentiment));
  const isSentimentShown = $derived(
    shownTab === SENTIMENT_TAB && $isRevampedHeader,
  );

  onMount(() => trackOpen({ source, tab: shownTab }));
</script>

<!-- The verdict answers beside the title, and only while its tab is shown. -->
{#snippet badge()}
  <RenderFor audience="vip">
    {#if verdict && isSentimentShown}
      <span class="trakt-insights-verdict" transition:fade={{ duration: 150 }}>
        <SummaryHeaderStatePill label={verdict.label} tone={verdict.verdict} />
      </span>
    {/if}
  </RenderFor>
{/snippet}

{#snippet sentimentView()}
  {#if sentiment !== null}
    <RenderFor audience="vip">
      {#if sentiment && $isRevampedHeader}
        <SentimentBands {sentiment} />
      {:else if sentiment}
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

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_insights()}
  variant="vip"
  size="auto"
  {badge}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      {#if hasTabs}
        <TabView
          value={activeTab}
          onChange={onTabChange}
          tabs={[
            {
              value: SENTIMENT_TAB,
              label: m.header_community_sentiment(),
              content: sentimentView,
            },
            {
              value: REALITY_CHECK_TAB,
              label: m.header_reality_check(),
              content: realityCheckView,
            },
          ]}
        />
      {:else if sentiment !== null}
        {@render sentimentView()}
      {:else}
        {@render realityCheckView()}
      {/if}
    </div>
  {/if}
</Drawer>

<style>
  .trakt-insights-verdict {
    display: inline-flex;
  }
</style>
