<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { DocumentaryCheck } from "$lib/requests/models/DocumentaryCheck.ts";
  import DocumentaryMakers from "$lib/sections/components/reality-check/DocumentaryMakers.svelte";
  import DocumentaryTierPill from "$lib/sections/components/reality-check/DocumentaryTierPill.svelte";
  import DocumentaryCheckUpsell from "./DocumentaryCheckUpsell.svelte";
  import DocumentaryDisputes from "./DocumentaryDisputes.svelte";

  const { documentaryCheck }: { documentaryCheck: DocumentaryCheck } =
    $props();
</script>

<div class="trakt-documentary-check-tab">
  <div class="documentary-hero">
    <DocumentaryTierPill tier={documentaryCheck.tier} size="large" />
    <p class="documentary-sentence">{documentaryCheck.summary}</p>
    <DocumentaryMakers makers={documentaryCheck.makers} />
  </div>

  <RenderFor audience="vip">
    {#if documentaryCheck.disputes.length > 0}
      <hr class="documentary-hairline" />
      <DocumentaryDisputes disputes={documentaryCheck.disputes} />
    {/if}
  </RenderFor>

  <RenderFor audience="free">
    <DocumentaryCheckUpsell />
  </RenderFor>
</div>

<style lang="scss">
  .trakt-documentary-check-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    .documentary-hero {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-s);
    }

    .documentary-sentence {
      font-size: var(--ni-18);
      font-weight: 600;
      line-height: 1.5;
    }

    .documentary-hairline {
      width: 100%;
      margin: 0;

      border: 0;
      border-top: var(--border-thickness-xxs) solid var(--color-border);
    }
  }
</style>
