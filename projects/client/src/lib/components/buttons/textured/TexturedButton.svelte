<script lang="ts">
  import type { ButtonProps } from "../ButtonProps";

  const { label, children, ...props }: ButtonProps = $props();
</script>

<button class="trakt-textured-button" {...props} aria-label={label}>
  <p class="button-label">{@render children()}</p>
</button>

<style>
  .trakt-textured-button {
    --color-background-button-light: color-mix(
      in srgb,
      var(--color-background-button) 35%,
      white 65%
    );

    all: unset;

    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
    cursor: pointer;

    background: var(--color-background-button);
    color: var(--color-foreground-button);

    position: relative;
    overflow: hidden;

    &,
    &::before {
      width: 14.1875rem;
      height: 3.25rem;
      padding: 0.75rem 1rem 1rem 1rem;
      box-sizing: border-box;
      border-radius: 0.75rem;

      box-shadow:
        0px 1px 2px 0px rgba(255, 255, 255, 0.48) inset,
        2px -4px 2px 0px rgba(0, 0, 0, 0.32) inset,
        0px 2px 8px 0px rgba(0, 0, 0, 0.32);
    }

    p {
      z-index: 1;
    }

    &::before {
      content: "";
      z-index: 0;

      position: absolute;
      top: 0;
      left: 0;

      opacity: 0;
      transition: opacity var(--transition-increment) ease-in-out;

      background: radial-gradient(
        59.13% 72.55% at 50.22% 118.63%,
        var(--color-background-button-light) 0%,
        var(--color-background-button) 100%
      );
    }

    &:hover::before {
      opacity: 1;
    }
  }
</style>
