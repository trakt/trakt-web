<script lang="ts">
  import AnticipatedIcon from "$lib/components/icons/AnticipatedIcon.svelte";
  import TagByType from "$lib/components/tags/TagByType.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    score,
    i18n,
    type = "text",
  }: {
    score: number;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet icon()}
  <AnticipatedIcon />
{/snippet}

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {i18n.toAnticipatedCount(score)}
  </p>
{/snippet}

<TagByType {type} {icon}>
  {@render content()}
</TagByType>
