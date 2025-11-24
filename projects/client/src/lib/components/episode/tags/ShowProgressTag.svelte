<script lang="ts">
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import { stretchedPercentage } from "$lib/utils/number/stretchedPercentage";

  type ShowProgressTagProps = {
    progress: number;
    total: number;
    runtime: number;
    i18n?: TagIntl;
  } & ChildrenProps;

  const {
    children,
    progress,
    total,
    runtime,
    i18n = TagIntlProvider,
  }: ShowProgressTagProps = $props();

  const percentage = $derived(stretchedPercentage({ value: progress, total }));
</script>

<ProgressTag progress={percentage} {total}>
  <div class="show-progress">
    <p class="tag bold capitalize no-wrap">
      {i18n.toDuration(runtime)}
    </p>
    <TagBar>
      {@render children()}
    </TagBar>
  </div>
</ProgressTag>

<style>
  .show-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-xs);

    position: relative;

    :global(.trakt-text-tag) {
      color: var(--color-text-progress-tag);
    }
  }
</style>
