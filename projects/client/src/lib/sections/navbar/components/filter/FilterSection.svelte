<script lang="ts">
  const { title, children }: { title: string } & ChildrenProps = $props();
</script>

<section class="trakt-filter-section">
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
  }
</style>
