<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    activityDate,
    i18n,
    type = "tag",
  }: {
    activityDate: Date;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet content()}
  <p class="meta-info capitalize no-wrap">
    {i18n.toActivityDate(activityDate)}
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
