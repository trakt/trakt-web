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
      color?: "inherit" | "default" | "classic";
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
    color: inherit;

    text-decoration: none;
    cursor: pointer;

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

    &[data-color="default"],
    &[data-color="classic"] {
      &,
      :global(*) {
        transition: color calc(var(--transition-increment) / 2) ease-in-out;
      }
    }

    &[data-color="classic"] {
      text-decoration: underline;

      &:visited {
        color: var(--red-300);

        :global(*) {
          color: var(--red-300);
        }
      }

      &:hover {
        color: var(--blue-600);

        :global(*) {
          color: var(--blue-600);
        }
      }
    }

    &[data-color="inherit"] {
      :global(*) {
        color: inherit;
      }

      &:visited,
      &:hover {
        color: inherit;

        :global(*) {
          color: inherit;
        }
      }
    }
  }
</style>
