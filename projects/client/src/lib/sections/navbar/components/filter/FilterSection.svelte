<script lang="ts">
  const {
    title,
    variant = "stacked",
    children,
  }: {
    title: string;
    variant?: "stacked" | "inline";
  } & ChildrenProps = $props();
</script>

<section class="trakt-filter-section" data-variant={variant}>
  <span class="section-title tag secondary uppercase">{title}</span>

  {@render children()}
</section>

<style>
  .trakt-filter-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .section-title {
      padding-inline-start: var(--ni-16);
      letter-spacing: var(--ni-1);
    }

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      min-height: var(--ni-44);

      .section-title {
        flex-shrink: 0;
      }
    }
  }
</style>
