<script lang="ts">
  const { title, description = "", children } = $props();
</script>

<section>
  <h2>{title}</h2>
  <p>{@html description}</p>

  {@render children()}
</section>

<style>
  section {
    margin-bottom: 3rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  :global(code) {
    background-color: #f5f5f5;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }
</style>
