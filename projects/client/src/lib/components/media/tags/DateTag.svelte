<script lang="ts">
  import TagByType from "$lib/components/tags/TagByType.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    date,
    i18n,
    type = "text",
  }: {
    date: Date;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {i18n.toDay(date)}
  </p>
{/snippet}

<TagByType {type}>
  {@render content()}
</TagByType>
