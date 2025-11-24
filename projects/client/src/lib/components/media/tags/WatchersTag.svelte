<script lang="ts">
  import WatchersIcon from "$lib/components/icons/WatchersIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    watchers,
    i18n,
    type = "text",
  }: {
    watchers: number;
    i18n: TagIntl;
    type?: TagType;
  } = $props();
</script>

{#snippet icon()}
  <WatchersIcon />
{/snippet}

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {i18n.toWatcherCount(watchers)}
  </p>
{/snippet}

{#if type === "text"}
  <TextTag {icon}>
    {@render content()}
  </TextTag>
{:else}
  <StemTag {icon}>
    {@render content()}
  </StemTag>
{/if}
