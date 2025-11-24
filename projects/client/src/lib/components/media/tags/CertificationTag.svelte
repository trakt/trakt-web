<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagType } from "./models/TagType";

  const {
    certification,
    type = "text",
  }: {
    certification: string;
    type?: TagType;
  } = $props();
</script>

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {certification}
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
