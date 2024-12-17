<script lang="ts">
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { navigateWithFocus } from "$lib/utils/actions/navigateWithFocus";

  const {
    children,
    href,
    target,
    color = "default",
    focusable = true,
    ...props
  }: ChildrenProps &
    HTMLAnchorProps &
    HTMLElementProps & {
      color?: "default" | "classic" | "inherit";
      focusable?: boolean;
    } = $props();

  const { isActive } = $derived(useActiveLink(href));
</script>

{#if href}
  <a
    {href}
    {target}
    tabindex={focusable ? 0 : -1}
    use:navigateWithFocus
    data-color={color}
    class="trakt-link"
    class:trakt-link-active={$isActive}
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
    text-decoration: none;
    cursor: pointer;
    transition: color var(--transition-increment) ease-in-out;
    display: inherit;

    :global(p, span) {
      color: inherit;
    }

    &:focus-visible {
      outline: none;
      position: relative;

      &:not(:has(p, span))::after {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 100%;
        height: 100%;
        outline: var(--ni-2) solid var(--color-link-active);
        border-radius: var(--ni-4);
        outline-offset: var(--ni-4);

        transition: border-radius var(--transition-increment) ease-in-out;
      }
    }

    &[data-color="default"] {
      &,
      &:visited {
        color: var(--color-foreground);
      }

      &:hover,
      &:focus-visible {
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
