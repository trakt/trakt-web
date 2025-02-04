<script lang="ts">
  import { TestId } from "$e2e/models/TestId";

  type MediaTitleProps = {
    title: string;
  };

  const { title }: MediaTitleProps = $props();
</script>

<h3
  class:short-title={title.length < 15}
  class:long-title={title.length > 25}
  data-testid={TestId.SummaryMediaTitle}
>
  {title}
</h3>

<style>
  h3 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-48));
  }
</style>
