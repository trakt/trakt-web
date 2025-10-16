<script lang="ts">
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { stretchedPercentage } from "$lib/utils/number/stretchedPercentage";

  type ShowProgressTagProps = {
    total: number;
    progress: number;
  } & ChildrenProps;

  const { children, total, progress }: ShowProgressTagProps = $props();
  const percentage = $derived(stretchedPercentage({ value: progress, total }));
</script>

<ProgressTag progress={percentage} {total}>
  {@render children()}
</ProgressTag>
