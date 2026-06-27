<script lang="ts">
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { Button } from "bits-ui";
  import { useGuardedHref } from "../../features/auth/stores/useGuardedHref";
  import { createButtonHost } from "./_internal/createButtonHost.svelte";
  import type { TraktActionButtonProps } from "./TraktActionButtonProps";

  type TraktActionButtonAnchorProps = HTMLAnchorProps & TraktActionButtonProps;

  const {
    children,
    label,
    variant = "primary",
    color = "default",
    size = "normal",
    style = "flat",
    navigationType,
    disabled,
    classList = "",
    ...props
  }: TraktActionButtonProps | TraktActionButtonAnchorProps = $props();

  const { guardedHref, originalHref } = $derived(
    useGuardedHref((props as TraktActionButtonAnchorProps).href),
  );

  const noscroll = $derived((props as TraktActionButtonAnchorProps).noscroll);
  const replacestate = $derived(
    (props as TraktActionButtonAnchorProps).replacestate,
  );

  const href = $derived($guardedHref);
  const { isActive } = $derived(useActiveLink($originalHref));

  const classNames = $derived(
    [
      "trakt-action-button",
      "trakt-button-link",
      $isActive && "trakt-link-active",
      classList,
    ]
      .filter(Boolean)
      .join(" "),
  );

  const host = createButtonHost({
    getProps: () => props,
    getHref: () => href,
    getDisabled: () => disabled,
    getClassName: () => classNames,
    getNoscroll: () => noscroll,
    getReplacestate: () => replacestate,
    getAttrs: () => ({
      "aria-label": label,
      "data-color": color,
      "data-variant": variant,
      "data-size": size,
      "data-style": style,
      "data-dpad-navigation": navigationType,
    }),
  });
</script>

<Button.Root {...host.rootProps}>
  {@render children()}
</Button.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // bits-ui renders the underlying element, so it never receives this
  // component's scope hash. Every selector is therefore wrapped in :global(),
  // anchored to the namespaced root, to survive Svelte's scoped-CSS pruning.
  $b: ".trakt-action-button";
  $on: ":not([disabled]):not([aria-disabled=true])";

  @mixin variant-styles($base, $color, $variant, $bg, $fg) {
    :global(#{$base}[data-color=#{$color}][data-variant=#{$variant}]) {
      --color-background-action-button: #{$bg};
      --color-foreground-action-button: #{$fg};
    }

    @include for-mouse {
      :global(#{$base}[data-color=#{$color}][data-variant=#{$variant}]:hover),
      :global(
          #{$base}[data-color=#{$color}][data-variant=#{$variant}]:focus-visible
        ) {
        --color-background-action-button: #{$fg};
        --color-foreground-action-button: #{$bg};
      }
    }
  }

  @mixin color-styles($base, $color) {
    $bg: var(--color-background-#{$color});
    $fg: var(--color-foreground-#{$color});

    @include variant-styles($base, $color, primary, $bg, $fg);
    @include variant-styles($base, $color, secondary, $fg, $bg);

    // Ghost foreground/background overrides are variant-pinned, so they are
    // emitted once per color rather than inside the per-variant block.
    :global(#{$base}[data-color=#{$color}][data-style=ghost][data-variant=primary]) {
      --color-foreground-action-button: var(--color-foreground);
    }

    :global(
        #{$base}[data-color=#{$color}][data-style=ghost][data-variant=secondary]
      ) {
      --color-background-action-button: var(--color-foreground);
    }

    @include for-mouse {
      :global(#{$base}[data-color=#{$color}]:focus-visible) {
        outline: var(--border-thickness-xs) solid
          var(--color-background-action-button);
      }

      :global(
          #{$base}[data-color=#{$color}][data-style=ghost][data-variant=secondary]:hover
        ),
      :global(
          #{$base}[data-color=#{$color}][data-style=ghost][data-variant=secondary]:focus-visible
        ) {
        --color-foreground-action-button: var(--color-foreground);
      }
    }
  }

  :global(#{$b}) {
    --button-size: var(--ni-40);

    all: unset;

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    width: var(--button-size);
    height: var(--button-size);
    padding: var(--ni-6);
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border-radius: var(--border-radius-m);
    background-color: var(--color-background-action-button);
    color: var(--color-foreground-action-button);

    transition: var(--transition-increment) cubic-bezier(0.22, 1, 0.36, 1);
    transition-property:
      background-color, color, box-shadow, transform, outline, outline-offset;
  }

  @each $color in "purple", "red", "blue", "orange", "default" {
    @include color-styles($b, $color);
  }

  :global(#{$b}:focus-visible) {
    outline-offset: var(--ni-2);
  }

  :global(#{$b}[disabled]),
  :global(#{$b}[aria-disabled=true]) {
    cursor: not-allowed;
    color: var(--color-foreground-button-disabled);
    background: var(
      --color-background-button-disabled,
      var(--color-surface-button-disabled)
    );
  }

  :global(#{$b}[disabled]::before),
  :global(#{$b}[aria-disabled=true]::before) {
    display: none;
  }

  @include for-mouse {
    :global(#{$b}:hover#{$on}) {
      box-shadow: 0 var(--ni-2) var(--ni-8) var(--ni-neg-2)
        color-mix(
          in srgb,
          var(--color-background-action-button) 50%,
          transparent
        );
    }
  }

  :global(#{$b}:active#{$on}) {
    transform: scale(0.92);
    box-shadow: none;
  }

  :global(#{$b}:active[disabled]),
  :global(#{$b}:active[aria-disabled=true]) {
    animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
  }

  :global(#{$b}[data-size=small]) {
    scale: 0.8;
    margin: var(--ni-neg-8);
  }

  :global(#{$b}[data-size=large]) {
    scale: 1.2;
    margin: var(--ni-4);
  }

  :global(#{$b}[data-variant=secondary]:not([data-style=ghost])#{$on}) {
    background-color: color-mix(
      in srgb,
      var(--color-foreground-action-button) 5%,
      transparent
    );
    border: var(--border-thickness-xxs) solid
      color-mix(
        in srgb,
        var(--color-foreground-action-button) 50%,
        transparent
      );
    color: var(--color-text-primary);
  }

  @include for-mouse {
    :global(#{$b}[data-variant=secondary]:not([data-style=ghost])#{$on}:hover) {
      background-color: var(--color-background-action-button);
      color: var(--color-foreground-action-button);
    }
  }

  :global(#{$b}[data-style=ghost]) {
    background-color: transparent;
  }

  @include for-mouse {
    :global(#{$b}[data-style=ghost]:hover) {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 10%,
        transparent
      );
    }
  }
</style>
