<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { appendGlobalParameters } from "$lib/features/parameters/appendGlobalParameters";
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";

  const {
    children,
    href,
    target,
    color = "default",
    focusable = true,
    noscroll,
    replacestate,
    label,
    navigationType,
    ...props
  }: ChildrenProps &
    HTMLAnchorProps &
    HTMLElementProps & {
      color?: "default" | "classic" | "inherit";
      focusable?: boolean;
      navigationType?: DpadNavigationType;
    } = $props();

  const { isActive } = $derived(useActiveLink(href));
</script>

<a
  {href}
  {target}
  use:triggerWithKeyboard
  use:appendGlobalParameters
  data-sveltekit-keepfocus
  data-sveltekit-noscroll={noscroll}
  data-sveltekit-replacestate={replacestate}
  tabindex={focusable ? 0 : -1}
  data-color={color}
  aria-label={label}
  class:trakt-link={!!href}
  class:trakt-link-active={$isActive}
  data-dpad-navigation={navigationType}
  class:trakt-no-link={!href}
  {...props}
>
  {@render children?.()}
</a>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-link {
    -webkit-tap-highlight-color: transparent;
    color: inherit;
    cursor: pointer;
    transition: var(--transition-increment) ease-in-out;
    transition-property: color, text-decoration;
    display: inline;
    position: relative;

    :global(p),
    :global(span) {
      color: inherit;
    }

    text-decoration: underline;
    text-underline-offset: var(--ni-2);
    text-decoration-thickness: var(--ni-2);

    &:focus-visible {
      outline: none;
      position: relative;
    }

    &[data-color="default"] {
      @include default-link-style;

      &.trakt-link-active {
        &,
        &:visited {
          color: var(--color-link-active);
        }
      }
    }

    &[data-color="classic"] {
      display: inline;

      &:visited {
        color: var(--red-300);
        text-decoration-color: var(--red-300);
      }

      @include for-mouse {
        &:hover {
          color: var(--blue-600);
          text-decoration-color: var(--blue-300);
        }
      }
    }
  }

  .trakt-no-link {
    all: unset;
  }
</style>
