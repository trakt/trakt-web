<script lang="ts">
  import TagByType from "$lib/components/tags/TagByType.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    runtime,
    i18n,
    type = "text",
  }: {
    runtime: number;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet content()}
  <p class="bold capitalize no-wrap">
    <bdi dir="auto">{i18n.toDuration(runtime)}</bdi>
  </p>
{/snippet}

<TagByType {type}>
  {@render content()}
</TagByType>
