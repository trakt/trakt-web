<script lang="ts">
  import { page } from "$app/state";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "./_internal/summaryDrawerNavigation";
  import DetailsDrawer from "./components/details/DetailsDrawer.svelte";
  import type { MediaDetailsProps } from "./components/details/MediaDetailsProps";
  import SentimentDrawer from "./components/sentiment/SentimentDrawer.svelte";

  const {
    sentiment,
    ...details
  }: { sentiment?: SentimentAnalysis | Nil } & MediaDetailsProps = $props();

  const { drawer, close } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === Drawers.Sentiment && sentiment}
  <SentimentDrawer {sentiment} onClose={close} />
{/if}

{#if drawer === Drawers.Details}
  <DetailsDrawer {...details} onClose={close} />
{/if}
