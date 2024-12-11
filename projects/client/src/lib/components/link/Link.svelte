<script lang="ts">
  import { page } from "$app/stores";

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
  <a
    {href}
    {target}
    data-color={color}
    class="trakt-link"
    class:trakt-link-active={$page.url.pathname === href}
    {...props}
  >
    {@render children?.()}
  </a>
{:else}
  {@render children?.()}
{/if}

<style>
  .trakt-link {
    -webkit-tap-highlight-color: transparent;
    color: inherit;
    display: contents;
    text-decoration: none;
    cursor: pointer;

    :global(&.trakt-link-active) {
      :global(.trakt-button) {
        background: color-mix(
          in srgb,
          var(--color-background-button) 40%,
          transparent 60%
        );
      }
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

    &[data-color="default"] {
      &,
      :global(*) {
        transition: color calc(var(--transition-increment) / 2) ease-in-out;
      }
    }

    &[data-color="classic"] {
      display: inline;
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
