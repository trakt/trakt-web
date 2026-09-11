<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { StemTagVariant } from "$lib/components/tags/StemTagVariant.ts";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    count,
    i18n,
    type = "text",
    variant,
  }: {
    count: number;
    i18n: TagIntl;
    type?: TagType;
    variant?: StemTagVariant;
  } = $props();
</script>

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {i18n.toEpisodeCount(count)}
  </p>
{/snippet}

{#if type === "text"}
  <TextTag>
    {@render content()}
  </TextTag>
{:else}
  <StemTag {variant}>
    {@render content()}
  </StemTag>
{/if}
