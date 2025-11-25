<script lang="ts">
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
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
  {i18n.toDuration(runtime)}
  {#snippet tags()}
    {@render children()}
  {/snippet}
</ProgressTag>
