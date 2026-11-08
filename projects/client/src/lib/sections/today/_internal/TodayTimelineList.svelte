<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<ul class="trakt-today-timeline-list drawer-timeline">
  {@render children()}
</ul>

<style>
  .drawer-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
