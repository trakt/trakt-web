<script lang="ts">
  import type { ButtonProps } from "../ButtonProps";

  const { label, children, ...props }: ButtonProps = $props();
</script>

<button class="trakt-textured-button" {...props} aria-label={label}>
  <p class="button-label">{@render children()}</p>
</button>

<style>
  .trakt-textured-button {
    all: unset;

    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;

    width: 14.1875rem;
    height: 3.25rem;
    padding: 0.75rem 1rem 1rem 1rem;
    box-sizing: border-box;

    border-radius: 0.75rem;
    background: var(--color-background-button);
    color: var(--color-foreground-button);

    box-shadow:
      0px 1px 2px 0px rgba(255, 255, 255, 0.48) inset,
      2px -4px 2px 0px rgba(0, 0, 0, 0.32) inset,
      0px 2px 8px 0px rgba(0, 0, 0, 0.32);
  }
</style>
