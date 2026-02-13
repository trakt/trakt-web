<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import { fade } from "svelte/transition";
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
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_community_sentiment()}
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
