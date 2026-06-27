<script lang="ts">
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { Button } from "bits-ui";
  import { useGuardedHref } from "../../features/auth/stores/useGuardedHref";
  import { createButtonHost } from "./_internal/createButtonHost.svelte";
  import type { TraktButtonProps } from "./TraktButtonProps";

  type TraktButtonAnchorProps = HTMLAnchorProps &
    TraktButtonProps & { onclickoutside?: (ev: CustomEvent) => void };

  const {
    label,
    children,
    variant = "primary",
    style = "flat",
    color = "custom",
    icon,
    subtitle,
    size = "normal",
    text = "capitalize",
    navigationType,
    disabled,
    "data-testid": dataTestId,
    ...props
  }: TraktButtonProps | TraktButtonAnchorProps = $props();

  const { guardedHref, originalHref } = $derived(
    useGuardedHref((props as TraktButtonAnchorProps).href),
  );
  const noscroll = $derived((props as TraktButtonAnchorProps).noscroll);
  const replacestate = $derived((props as TraktButtonAnchorProps).replacestate);

  const href = $derived($guardedHref);
  const { isActive } = $derived(useActiveLink($originalHref));

  const hasIcon = $derived(icon != null);
  const alignment = $derived(hasIcon ? "default" : "centered");

  const classList = $derived(
    [
      "trakt-button",
      href != null && "trakt-button-link",
      $isActive && "trakt-link-active",
    ]
      .filter(Boolean)
      .join(" "),
  );

  const host = createButtonHost({
    getProps: () => props,
    getHref: () => href,
    getDisabled: () => disabled,
    getClassName: () => classList,
    getNoscroll: () => noscroll,
    getReplacestate: () => replacestate,
    getAttrs: () => ({
      "aria-label": label,
      "data-variant": variant,
      "data-alignment": alignment,
      "data-style": style,
      "data-color": color,
      "data-size": size,
      "data-dpad-navigation": navigationType,
      "data-testid": dataTestId,
    }),
    commonActions: [
      (node) => disableTransitionOn(node, "touch"),
      (node) => clickOutside(node),
    ],
  });
</script>

{#snippet contents()}
  <div class="button-label">
    <p
      class="ellipsis bold"
      class:small={subtitle != null || style === "underlined"}
      class:capitalize={text === "capitalize"}
      class:uppercase={text === "uppercase"}
    >
      {@render children()}
    </p>
    {#if subtitle != null}
      <p class="button-subtitle">{@render subtitle()}</p>
    {/if}
  </div>
  {#if icon}
    <div class="button-icon">
      {@render icon()}
    </div>
  {/if}
{/snippet}

<Button.Root {...host.rootProps}>
  {@render contents()}
</Button.Root>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  // bits-ui renders the underlying element, so it never receives this
  // component's scope hash. Every selector is therefore wrapped in :global(),
  // anchored to the namespaced root, to survive Svelte's scoped-CSS pruning.
  $b: ".trakt-button";
  $on: ":not([disabled]):not([aria-disabled=true])";

  @mixin variant-styles($base, $color, $variant, $bg, $fg) {
    :global(#{$base}[data-color=#{$color}][data-variant=#{$variant}]) {
      --color-background-button: #{$bg};
      --color-foreground-button: #{$fg};
    }

    @include for-mouse {
      :global(
          #{$base}[data-color=#{$color}][data-variant=#{$variant}]:not([data-style=ghost]):hover
        ),
      :global(
          #{$base}[data-color=#{$color}][data-variant=#{$variant}]:not([data-style=ghost]):focus-visible
        ) {
        --color-foreground-button: #{$bg};
        --color-background-button: #{$fg};
      }
    }
  }

  @mixin color-styles($base, $color) {
    $bg: var(--color-background-#{$color});
    $fg: var(--color-foreground-#{$color});

    @include variant-styles($base, $color, primary, $bg, $fg);
    @include variant-styles($base, $color, secondary, $fg, $bg);

    @include for-mouse {
      :global(#{$base}[data-color=#{$color}]:focus-visible) {
        outline: var(--border-thickness-xs) solid
          var(--color-foreground-button);
      }
    }
  }

  :global(#{$b}) {
    --color-background-button-outline: color-mix(
      in srgb,
      var(--color-background-button) 10%,
      var(--color-foreground) 90%
    );

    --scale-factor-button: 1;
    --button-height: var(--ni-52);

    all: unset;
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-width: var(--ni-40);
    padding: var(--ni-16);
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    background: var(--color-background-button);
    color: var(--color-foreground-button);

    position: relative;
    overflow: hidden;

    transition: var(--transition-increment) cubic-bezier(0.22, 1, 0.36, 1);
    transition-property:
      box-shadow, outline, outline-offset, padding, transform, color,
      background, text-decoration;
  }

  :global(#{$b} .button-icon) {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  // Needed to make ellipses work with flex
  // https://css-tricks.com/flexbox-truncated-text/
  :global(#{$b} .button-label) {
    min-width: 0;
  }

  :global(#{$b} p),
  :global(#{$b} .button-label),
  :global(#{$b} .button-icon) {
    z-index: var(--layer-base);
  }

  :global(#{$b}.trakt-button-link[data-style=ghost].trakt-link-active) {
    color: var(--color-background-button);
  }

  :global(#{$b}.trakt-button-link[data-style=underlined].trakt-link-active) {
    text-decoration-color: color-mix(
      in srgb,
      var(--color-background-button) 80%,
      white 20%
    );
    text-decoration-line: underline;
  }

  @each $color in "purple", "red", "blue", "orange", "default", "custom" {
    @include color-styles($b, $color);
  }

  :global(#{$b}[data-alignment=default]) {
    justify-content: space-between;
  }

  :global(#{$b}[data-alignment=centered]) {
    justify-content: center;
  }

  // TODO: revert this once the dynamic scaling is figured out
  :global(#{$b}[data-size=small] .button-label p),
  :global(#{$b}[data-size=tag] .button-label p) {
    font-size: 0.75rem;
  }

  :global(#{$b}[data-size=small] .button-icon svg),
  :global(#{$b}[data-size=tag] .button-icon svg) {
    width: auto;
    height: var(--ni-18);
  }

  :global(#{$b}[data-size=small]) {
    --button-height: var(--ni-40);
    border-radius: calc(var(--border-radius-m) * 0.8);
    padding: var(--ni-12);
    gap: var(--ni-12);
  }

  :global(#{$b}[data-size=tag]) {
    --button-height: var(--ni-18);
    padding: var(--ni-2) var(--ni-10);
    min-width: var(--ni-48);
    box-sizing: border-box;
  }

  :global(#{$b}[data-size=tag][data-style=ghost]) {
    margin: 0;
  }

  :global(#{$b}),
  :global(#{$b}::before),
  :global(#{$b}:active[disabled]) {
    height: var(--button-height);
    box-sizing: border-box;
    border-radius: var(--border-radius-m);
  }

  :global(#{$b}::before) {
    content: "";

    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;

    opacity: 0;
    transition: opacity var(--transition-increment) ease-in-out;
  }

  @include for-mouse {
    :global(#{$b}:hover::before),
    :global(#{$b}:focus-visible::before) {
      opacity: 1;
    }
  }

  :global(#{$b}:active::before) {
    opacity: 0;
  }

  :global(#{$b}:active[disabled]) {
    animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
  }

  :global(#{$b}:focus-visible) {
    outline: var(--border-thickness-xs) solid
      var(--color-background-button-outline);
    outline-offset: var(--ni-2);
  }

  :global(#{$b}[disabled]),
  :global(#{$b}[aria-disabled=true]) {
    cursor: not-allowed;
    color: var(--color-foreground-button-disabled);
    background: var(--color-surface-button-disabled);
  }

  :global(#{$b}[disabled]::before),
  :global(#{$b}[aria-disabled=true]::before) {
    display: none;
  }

  :global(#{$b}[data-style=ghost]) {
    margin: var(--ni-neg-4) var(--ni-neg-10);
    transform: scale(calc(var(--scale-factor-button) * 0.76925));
    background: transparent;
  }

  :global(#{$b}[data-style=ghost]:not([data-variant=secondary])) {
    color: var(--color-foreground);
  }

  :global(#{$b}[data-style=ghost][disabled]),
  :global(#{$b}[data-style=ghost][aria-disabled=true]) {
    color: var(--color-foreground-button-disabled);
  }

  @include for-mouse {
    :global(#{$b}[data-style=ghost]:hover#{$on}) {
      color: var(--color-foreground-button);
    }

    :global(#{$b}[data-style=ghost]:hover#{$on}[data-size=tag]) {
      outline: var(--border-thickness-xs) solid var(--color-background-button);
    }

    :global(#{$b}[data-style=ghost]:hover#{$on}[data-variant=primary]) {
      background: var(--color-background-button);
    }

    :global(#{$b}[data-style=ghost]:hover#{$on}[data-variant=secondary]) {
      background: color-mix(
        in srgb,
        var(--color-foreground-button) 10%,
        transparent 90%
      );
    }
  }

  :global(#{$b}[data-style=ghost]:active#{$on}) {
    transform: scale(calc(var(--scale-factor-button) * 0.7));
  }

  :global(#{$b}[data-style=ghost][data-size=tag]) {
    outline: var(--border-thickness-xxs) solid var(--color-foreground);
  }

  @include for-mouse {
    :global(#{$b}[data-style=flat]:hover#{$on}) {
      box-shadow: 0 var(--ni-4) var(--ni-12) var(--ni-neg-2)
        color-mix(in srgb, var(--color-background-button) 45%, transparent);
      transform: translateY(calc(var(--ni-1) * -1));
    }
  }

  :global(#{$b}[data-style=flat]:active#{$on}) {
    transform: scale(calc(var(--scale-factor-button) * 0.97));
    box-shadow: none;
  }

  :global(#{$b}[data-style=underlined]) {
    --underline-offset: var(--ni-4);
    --line-thickness: var(--ni-2);

    background: transparent;
    text-decoration-color: transparent;
    color: var(--color-foreground);

    text-underline-offset: var(--underline-offset);
    text-decoration-thickness: var(--line-thickness);
    line-height: calc(100% + var(--underline-offset) + var(--line-thickness));
  }

  :global(#{$b}[data-style=underlined][disabled]),
  :global(#{$b}[data-style=underlined][aria-disabled=true]) {
    color: var(--color-foreground-button-disabled);
  }

  @include for-mouse {
    :global(#{$b}[data-style=underlined]:hover#{$on}) {
      text-decoration-line: underline;
      text-decoration-color: var(--color-foreground);
    }

    :global(#{$b}[data-style=underlined]:hover#{$on}:not(.trakt-link-active)) {
      color: color-mix(
        in srgb,
        var(--color-foreground-button) 80%,
        white 20%
      );
    }
  }
</style>
