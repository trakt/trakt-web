<script lang="ts">
  import TagByType from "$lib/components/tags/TagByType.svelte";
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

<TagByType {type}>
  {@render content()}
</TagByType>
