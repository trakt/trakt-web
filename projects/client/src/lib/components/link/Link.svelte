<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { mobileAppleDeviceTriggerHack } from "$lib/utils/actions/mobileAppleDeviceTriggerHack";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";

  const {
    children,
    href,
    target,
    color = "default",
    focusable = true,
    noscroll,
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

{#if href}
  <a
    {href}
    {target}
    use:triggerWithKeyboard
    use:mobileAppleDeviceTriggerHack
    data-sveltekit-keepfocus
    data-sveltekit-noscroll={noscroll}
    tabindex={focusable ? 0 : -1}
    data-color={color}
    aria-label={label}
    class="trakt-link"
    class:trakt-link-active={$isActive}
    data-dpad-navigation={navigationType}
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
    cursor: pointer;
    transition: var(--transition-increment) ease-in-out;
    transition-property: color, text-decoration;
    display: inherit;

    :global(p),
    :global(span) {
      color: inherit;
    }

    text-decoration: underline;
    text-underline-offset: var(--ni-2);
    text-decoration-thickness: var(--ni-2);

    :global(.trakt-card-cover) {
      transition: transform var(--transition-increment) ease-in-out;
    }

    &:focus-visible {
      outline: none;
      position: relative;

      &:has(:global(.trakt-card-cover))::after {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 100%;
        height: 100%;
        outline: var(--border-thickness-s) solid var(--color-link-active);
        border-radius: var(--border-radius-m);
        outline-offset: calc(-1 * var(--border-thickness-s));

        transition: border-radius var(--transition-increment) ease-in-out;
      }

      :global(.trakt-card-cover) {
        transform: scale(0.9);
        transform-origin: center;
      }
    }

    &[data-color="default"] {
      @include default-link-style;

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
</style>
