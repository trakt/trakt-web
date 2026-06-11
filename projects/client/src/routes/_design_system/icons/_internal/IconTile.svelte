<script lang="ts">
  const { name, children }: { name: string } & ChildrenProps = $props();
</script>

<article class="icon-card">
  <div class="icon-preview">
    {@render children?.()}
  </div>
  <span class="small bold">{name}</span>
</article>

<style>
  .icon-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    min-width: 0;
    padding: var(--ni-12);

    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: color-mix(
      in srgb,
      var(--color-card-background) 80%,
      transparent
    );
  }

  .icon-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--ni-64);
    color: var(--color-text-primary);
  }

  .icon-preview :global(svg) {
    max-width: var(--ni-56);
    max-height: var(--ni-56);
  }
</style>
