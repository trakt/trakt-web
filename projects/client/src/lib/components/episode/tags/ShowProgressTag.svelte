<script lang="ts">
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { stretchedPercentage } from "$lib/utils/number/stretchedPercentage";
  import type { Snippet } from "svelte";

  type ShowProgressTagProps = {
    progress: number;
    total: number;
    runtime: number;
    tags: Snippet;
    i18n?: TagIntl;
    style?: "summary" | "cover";
  };

  const {
    tags: externalTags,
    progress,
    total,
    runtime,
    i18n = TagIntlProvider,
    style,
  }: ShowProgressTagProps = $props();

  const percentage = $derived(stretchedPercentage({ value: progress, total }));
</script>

{#snippet tags()}
  {#if style === "cover"}
    {@render externalTags()}
  {:else}
    <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
      {@render externalTags()}
    </RenderFor>
  {/if}
{/snippet}

<div class="trakt-show-progress-tag">
  <ProgressTag progress={percentage} {total} {tags}>
    {i18n.toDuration(runtime)}
  </ProgressTag>
  {#if style === "summary"}
    <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
      <div class="trakt-show-progress-tags">
        {@render externalTags()}
      </div>
    </RenderFor>
  {/if}
</div>

<style>
  .trakt-show-progress-tag {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-show-progress-tags {
    display: flex;
    justify-content: space-around;
    gap: var(--gap-micro);
    flex-wrap: wrap;
  }
</style>
