<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    control,
    variant = "stacked",
    children,
  }: {
    title: string;
    control?: Snippet;
    variant?: "stacked" | "inline";
  } & ChildrenProps = $props();
</script>

<section class="trakt-filter-section" data-variant={variant}>
  <header class="section-head">
    <span class="section-title tag secondary uppercase">{title}</span>
    {@render control?.()}
  </header>

  {@render children()}
</section>

<style lang="scss">
  .trakt-filter-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      min-height: var(--ni-32);
    }

    .section-title {
      letter-spacing: var(--ni-1);
    }

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      gap: var(--gap-s);

      min-height: var(--ni-44);

      .section-head {
        flex: 1;
        min-width: 0;
      }
    }
  }
</style>
