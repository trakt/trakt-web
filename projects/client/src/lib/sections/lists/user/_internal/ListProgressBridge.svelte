<script lang="ts">
  import type { ListProgress } from "../../_internal/getListProgress.ts";

  const {
    progress,
    onProgressChange,
  }: {
    progress: ListProgress;
    onProgressChange: (progress: ListProgress) => void;
  } = $props();

  $effect(() => {
    onProgressChange(progress);
  });
</script>
