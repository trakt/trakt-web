<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    runtime,
    i18n,
    isTextOnly = false,
  }: {
    runtime: number;
    i18n: TagIntl;
    isTextOnly?: boolean;
  } = $props();
</script>

{#snippet content()}
  <p class="meta-info capitalize no-wrap">
    {i18n.toDuration(runtime)}
  </p>
{/snippet}

{#if isTextOnly}
  <TextTag>
    {@render content()}
  </TextTag>
{:else}
  <StemTag>
    {@render content()}
  </StemTag>
{/if}
