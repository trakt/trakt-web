<script lang="ts">
  import TagByType from "$lib/components/tags/TagByType.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    activityDate,
    i18n,
    type = "text",
  }: {
    activityDate: Date;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {i18n.toActivityDate(activityDate)}
  </p>
{/snippet}

<TagByType {type}>
  {@render content()}
</TagByType>
