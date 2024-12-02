<script lang="ts">
  const {
    children,
    href,
    target,
    color,
    ...props
  }: ChildrenProps &
    HTMLAnchorProps &
    HTMLElementProps & {
      color?: "inherit" | "default";
    } = $props();
</script>

{#if href}
  <a {href} {target} data-color={color} class="trakt-link" {...props}>
    {@render children?.()}
  </a>
{:else}
  {@render children?.()}
{/if}

<style>
  .trakt-link {
    -webkit-tap-highlight-color: transparent;
    display: content;
    color: inherit;

    text-decoration: none;
    cursor: pointer;

    :global(*) {
      transition: color calc(var(--transition-increment) / 2) ease-in-out;
    }

    &:visited {
      color: inherit;
    }

    &:hover {
      :global(*) {
        color: var(--color-text-secondary);
      }
    }

    &[data-color="inherit"] {
      color: inherit;

      &:visited,
      &:hover {
        color: inherit;
      }
    }
  }
</style>
