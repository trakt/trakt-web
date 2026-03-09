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
  };

  const {
    tags,
    progress,
    total,
    runtime,
    i18n = TagIntlProvider,
  }: ShowProgressTagProps = $props();

  const percentage = $derived(stretchedPercentage({ value: progress, total }));
</script>

<ProgressTag progress={percentage} {total} {tags}>
  {i18n.toDuration(runtime)}
</ProgressTag>
