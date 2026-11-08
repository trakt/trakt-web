<script lang="ts">
  import WatchersIcon from "$lib/components/icons/WatchersIcon.svelte";
  import TagByType from "$lib/components/tags/TagByType.svelte";
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

<TagByType {type} {icon}>
  {@render content()}
</TagByType>
