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
    display: contents;
    color: inherit;

    text-decoration: none;
    cursor: pointer;

    &[data-color="default"] :global(*) {
      transition: color calc(var(--transition-increment) / 2) ease-in-out;
    }

    &:visited {
      :global(*) {
        color: inherit;
      }
    }

    &:hover {
      :global(*) {
        color: var(--color-text-secondary);
      }
    }

    &[data-color="inherit"] {
      :global(*) {
        color: inherit;
      }

      &:visited,
      &:hover {
        :global(*) {
          color: inherit;
        }
      }
    }
  }
</style>
