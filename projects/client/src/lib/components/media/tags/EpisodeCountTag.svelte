<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    count,
    i18n,
    type = "tag",
  }: {
    count: number;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet content()}
  <p class="meta-info capitalize no-wrap">
    {i18n.toEpisodeCount(count)}
  </p>
{/snippet}

{#if type === "text"}
  <TextTag>
    {@render content()}
  </TextTag>
{:else}
  <StemTag>
    {@render content()}
  </StemTag>
{/if}
