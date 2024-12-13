<script lang="ts">
  import { page } from "$app/stores";
  import { navigateWithFocus } from "$lib/utils/actions/navigateWithFocus";

  const {
    children,
    href,
    target,
    color = "default",
    ...props
  }: ChildrenProps &
    HTMLAnchorProps &
    HTMLElementProps & {
      color?: "default" | "classic";
    } = $props();
</script>

{#if href}
  <a
    {href}
    {target}
    use:navigateWithFocus
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
    transition: color var(--transition-increment) ease-in-out;
    display: inherit;

    :global(p, span) {
      color: inherit;
    }

    &[data-color="default"] {
      &,
      &:visited {
        color: var(--color-foreground);
      }

      &:hover {
        color: var(--color-link-active);
      }

      &.trakt-link-active {
        &,
        &:visited {
          color: var(--color-link-active);
        }

        &:hover {
          color: var(--color-foreground);
        }
      }
    }

    &[data-color="classic"] {
      display: inline;
      text-decoration: underline;

      &:visited {
        color: var(--red-300);
      }

      &:hover {
        color: var(--blue-600);
      }
    }
  }
</style>
