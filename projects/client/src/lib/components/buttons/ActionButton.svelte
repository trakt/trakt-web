<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
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
    tooltip = true,
    classList = "",
    progress,
    ...props
  }: TraktActionButtonProps | TraktActionButtonAnchorProps = $props();

  // Icon-only buttons carry no visible text, so their required `label` doubles
  // as a hover tooltip - a pointer-only affordance, gated on mouse so touch is
  // untouched (tap just fires the action). Opt out with `tooltip={false}` where
  // the caller supplies its own tooltip (e.g. custom copy/side).

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
      "data-progress": progress ? "" : undefined,
      style: progress ? `--action-button-progress: ${progress}` : undefined,
    }),
  });
</script>

<Tooltip content={label} variant="compact" disabled={!tooltip}>
  <Button.Root {...host.rootProps}>
    {@render children()}
  </Button.Root>
</Tooltip>

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

    :global(#{$base}[data-color=#{$color}]) {
      --accent-action-button: var(--color-accent-#{$color}, #{$bg});
      --surface-action-button: #{$bg};
    }

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

    display: flex;
    width: var(--button-size);
    height: var(--button-size);
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background-color: var(--color-background-action-button);
    color: var(--color-foreground-action-button);
  }

  @include icon-button-box($b);

  @each $color in "purple", "red", "blue", "orange", "default" {
    @include color-styles($b, $color);
  }

  :global(#{$b}:focus-visible) {
    outline-offset: var(--ni-2);
  }

  :global(#{$b}[data-progress]) {
    --action-button-progress-inset: var(--ni-4);

    position: relative;
    isolation: isolate;
  }

  :global(#{$b}[data-progress][data-variant="primary"]) {
    transition-property:
      background-color, color, box-shadow, transform, outline, outline-offset;
    transition-delay:
      var(--transition-increment), var(--transition-increment), 0s, 0s, 0s, 0s;
  }

  :global(#{$b}[data-progress]::before) {
    --action-button-progress-min: calc(
      var(--button-size) - 2 * var(--action-button-progress-inset) +
        var(--ni-4)
    );

    content: "";
    position: absolute;
    inset-block: var(--action-button-progress-inset);
    inset-inline-start: var(--action-button-progress-inset);
    z-index: -1;

    width: max(
      var(--action-button-progress-min),
      calc(
        (100% - 2 * var(--action-button-progress-inset)) *
          var(--action-button-progress) / 100
      )
    );
    border-radius: var(--border-radius-pill);
    background-color: color-mix(
      in srgb,
      var(--surface-action-button) 26%,
      transparent
    );

    transition: var(--transition-increment) ease-in;
    transition-property: width, background-color, opacity;
  }

  :global(#{$b}[data-progress]::after) {
    content: "";
    position: absolute;
    inset: var(--action-button-progress-inset);
    z-index: -2;

    border-radius: var(--border-radius-pill);
    background-color: color-mix(
      in srgb,
      var(--surface-action-button) 10%,
      transparent
    );

    transition: opacity var(--transition-increment) ease-in;
  }

  :global(#{$b}[data-progress][data-variant="primary"]::before) {
    opacity: 0;
    transition-delay: 0s, 0s, calc(2 * var(--transition-increment));
  }

  :global(#{$b}[data-progress][data-variant="primary"]::after) {
    opacity: 0;
    transition-delay: calc(2 * var(--transition-increment));
  }

  @include for-mouse {
    :global(#{$b}[data-progress]:hover#{$on}::before),
    :global(#{$b}[data-progress]:focus-visible#{$on}::before) {
      background-color: color-mix(
        in srgb,
        var(--surface-action-button) 40%,
        transparent
      );
    }
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
  :global(#{$b}[aria-disabled=true]::before),
  :global(#{$b}[disabled]::after),
  :global(#{$b}[aria-disabled=true]::after) {
    display: none;
  }

  @include flat-outline-button(
    $b,
    var(--accent-action-button),
    var(--surface-action-button),
    scale(0.92)
  );

  @include icon-button-ghost("#{$b}[data-style=ghost]", scale(0.92), $on);

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

</style>
