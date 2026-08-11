<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import { fade } from "svelte/transition";
  import { toSummarySentiment } from "../header-kit/toSummarySentiment.ts";
  import SentimentContent from "./_internal/SentimentContent.svelte";
  import SentimentUpsell from "./_internal/SentimentUpsell.svelte";

  const {
    onClose,
    sentiment,
  }: {
    sentiment: SentimentAnalysis;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);

  /* The verdict beside the title - the drawer answers before it explains. */
  const verdict = $derived(toSummarySentiment(sentiment));
</script>

{#snippet metaInfo()}
  {#if verdict}
    <span class="sentiment-verdict" data-verdict={verdict.verdict}>
      {verdict.label}
    </span>
  {/if}
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_community_sentiment()}
  {metaInfo}
  variant="vip"
  size="auto"
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="vip">
        <SentimentContent {sentiment} />
      </RenderFor>

      <RenderFor audience="free">
        <SentimentUpsell />
      </RenderFor>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  /* The summary screen's own verdict pill - one system, everywhere. */
  .sentiment-verdict {
    align-self: flex-start;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    padding: var(--ni-4) var(--ni-10);
    border-radius: 999px;

    color: var(--sentiment-color);
    background: color-mix(in srgb, var(--sentiment-color) 16%, transparent);

    &[data-verdict="positive"] {
      --sentiment-color: var(--green-400);
    }

    &[data-verdict="mixed"] {
      --sentiment-color: var(--yellow-400);
    }

    &[data-verdict="negative"] {
      --sentiment-color: var(--red-400);
    }
  }
</style>
