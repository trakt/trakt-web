<script lang="ts">
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { stretchedPercentage } from "$lib/utils/number/stretchedPercentage";
  import type { Snippet } from "svelte";

  type ShowProgressTagProps = {
    progress: number;
    total: number;
    runtime: number;
    tags: Snippet;
    i18n?: TagIntl;
    hasRuntime?: boolean;
  };

  const {
    tags,
    progress,
    total,
    runtime,
    i18n = TagIntlProvider,
    hasRuntime = true,
  }: ShowProgressTagProps = $props();

  const percentage = $derived(stretchedPercentage({ value: progress, total }));
</script>

{#snippet runtimeLabel()}
  {i18n.toDuration(runtime)}
{/snippet}

<div class="trakt-show-progress-tag">
  <ProgressTag
    progress={percentage}
    {total}
    {tags}
    children={hasRuntime ? runtimeLabel : undefined}
  />
</div>

<style>
  .trakt-show-progress-tag {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
