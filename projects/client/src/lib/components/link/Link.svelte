<script lang="ts">
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import { triggerWithTouch } from "$lib/utils/actions/triggerWithTouch";

  const {
    children,
    href,
    target,
    color = "default",
    focusable = true,
    retrigger = true,
    ...props
  }: ChildrenProps &
    HTMLAnchorProps &
    HTMLElementProps & {
      color?: "default" | "classic" | "inherit";
      focusable?: boolean;
      retrigger?: boolean;
    } = $props();

  const { isActive } = $derived(useActiveLink(href));
</script>

{#if href}
  <a
    {href}
    {target}
    use:triggerWithTouch={retrigger}
    use:triggerWithKeyboard
    data-sveltekit-keepfocus
    tabindex={focusable ? 0 : -1}
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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-link {
    -webkit-tap-highlight-color: transparent;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: color var(--transition-increment) ease-in-out;
    display: inherit;

    :global(p),
    :global(span) {
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
        outline: var(--border-thickness-xs) solid var(--color-link-active);
        border-radius: var(--border-radius-xs);
        outline-offset: var(--border-thickness-s);

        transition: border-radius var(--transition-increment) ease-in-out;
      }
    }

    &[data-color="default"] {
      &,
      &:visited {
        color: var(--color-foreground);
      }

      @include for-mouse {
        &:hover,
        &:focus-visible {
          color: var(--color-link-active);
        }
      }

      &.trakt-link-active {
        &,
        &:visited {
          color: var(--color-link-active);
        }

        @include for-mouse {
          &:hover {
            color: var(--color-foreground);
          }
        }
      }
    }

    &[data-color="classic"] {
      display: inline;
      text-decoration: underline;

      &:visited {
        color: var(--red-300);
      }

      @include for-mouse {
        &:hover {
          color: var(--blue-600);
        }
      }
    }
  }
</style>
