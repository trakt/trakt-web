<script lang="ts">
  import AnticipatedIcon from "$lib/components/icons/AnticipatedIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    score,
    i18n,
    isTextOnly = false,
  }: {
    score: number;
    i18n: TagIntl;
    isTextOnly?: boolean;
  } = $props();
</script>

{#snippet icon()}
  <AnticipatedIcon />
{/snippet}

{#snippet content()}
  <p class="meta-info capitalize no-wrap">
    {i18n.toAnticipatedCount(score)}
  </p>
{/snippet}

{#if isTextOnly}
  <TextTag {icon}>
    {@render content()}
  </TextTag>
{:else}
  <StemTag {icon}>
    {@render content()}
  </StemTag>
{/if}
