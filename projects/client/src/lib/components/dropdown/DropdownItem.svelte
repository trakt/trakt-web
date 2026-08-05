<script lang="ts">
  import { disableNavigation } from "$lib/utils/actions/disableNavigation";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import type { Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type DropdownItemProps = {
    color?: "red" | "purple" | "blue" | "orange" | "default";
    tabindex?: number;
    icon?: Snippet;
    end?: Snippet;
    subtitle?: Snippet;
    style?: "ghost" | "flat";
    variant?: "primary" | "secondary";
    selected?: boolean;
  } & ChildrenProps &
    HTMLElementProps;

  type DropdownItemAnchorProps = DropdownItemProps & HTMLAnchorProps;

  const {
    color = "purple",
    style = "ghost",
    variant = "primary",
    selected = false,
    children,
    icon,
    end,
    subtitle,
    ...props
  }: DropdownItemProps | DropdownItemAnchorProps = $props();

  const hasHandler = $derived(
    Object.keys(props).some((propName) => propName.startsWith("on")),
  );
  const tabIndex = $derived(hasHandler ? 0 : -1);
  const href = $derived((props as DropdownItemAnchorProps).href);
  const itemRole = $derived(hasHandler && !href ? "button" : undefined);
  const noscroll = $derived((props as DropdownItemAnchorProps).noscroll);
  const replacestate = $derived(
    (props as DropdownItemAnchorProps).replacestate,
  );
  const target = $derived((props as DropdownItemAnchorProps).target);

  // FIXME: use button when not href & update selectors in applicable icons
</script>

{#snippet text()}
  <div class="item-label">
    <p class="bold capitalize ellipsis">{@render children()}</p>
    {#if subtitle}
      <p class="small secondary ellipsis">{@render subtitle()}</p>
    {/if}
  </div>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<li
  use:triggerWithKeyboard
  use:disableNavigation={props.disabled}
  role={itemRole}
  tabindex={tabIndex}
  data-color={color}
  data-style={style}
  data-variant={variant}
  class:is-selected={selected}
  class:has-subtitle={subtitle != null}
  {...props}
>
  {#if href}
    <Link {href} {noscroll} {replacestate} {target} color="inherit">
      {#if icon}
        <div class="item-icon">
          {@render icon()}
        </div>
      {/if}
      {@render text()}
      {#if end}
        <div class="item-end">
          {@render end()}
        </div>
      {/if}
    </Link>
  {:else}
    {#if icon}
      <div class="item-icon">
        {@render icon()}
      </div>
    {/if}
    {@render text()}
    {#if end}
      <div class="item-end">
        {@render end()}
      </div>
    {/if}
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  li {
    --icon-gap: var(--gap-s);

    text-decoration: none;
    list-style-type: none;
    user-select: none;

    // Layout and surface resolve through configuration tokens so a container
    // (e.g. DropdownGroup) can render items as flush rows by setting these on
    // the list, instead of fighting these rules from the outside.
    padding: var(--dropdown-item-padding-block, 0)
      var(--dropdown-item-padding-inline, var(--ni-12));
    height: var(--dropdown-item-height, calc(var(--ni-20) + var(--ni-12) * 2));
    width: 100%;
    box-sizing: border-box;
    border-radius: var(--dropdown-item-radius, var(--border-radius-m));

    align-content: center;
    justify-self: center;

    display: flex;
    align-items: center;
    gap: var(--icon-gap);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background, color;

    &.has-subtitle {
      height: var(--dropdown-item-height, auto);
      padding-block: var(--dropdown-item-padding-block, var(--ni-8));
    }

    .item-label {
      min-width: 0;
    }

    .item-icon {
      display: flex;

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    .item-end {
      display: flex;
      margin-inline-start: auto;

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    &:active[disabled="true"] {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &[disabled="true"] {
      cursor: not-allowed;
    }

    :global(.trakt-link) {
      color: inherit;

      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      gap: var(--icon-gap);

      text-decoration: none;
    }

    @mixin variant($color, $bg-color) {
      color: var(--dropdown-item-foreground, #{$color});

      @include for-mouse {
        &:hover:not([disabled="true"]) {
          background: var(--dropdown-item-background-hover, #{$bg-color});
        }
      }

      &[data-style="flat"] {
        background: var(--dropdown-item-background, #{$color});
        color: var(--dropdown-item-foreground, #{$bg-color});

        @include for-mouse {
          &:hover:not([disabled="true"]) {
            background: var(--dropdown-item-background-hover, #{$bg-color});
            color: var(--dropdown-item-foreground, #{$color});
          }
        }
      }

      &[disabled="true"] {
        background: var(
          --dropdown-item-background,
          var(--color-foreground-button-disabled)
        );
        color: var(
          --dropdown-item-foreground,
          var(--color-surface-button-disabled)
        );
      }

      &.is-selected {
        background: var(
          --dropdown-item-background-selected,
          var(--color-foreground-button-disabled)
        );
        color: var(
          --dropdown-item-foreground,
          var(--color-surface-button-disabled)
        );
      }
    }

    @mixin color($color, $active-bg, $outline-color, $bg-color) {
      &[data-variant="primary"] {
        @include variant($color, $bg-color);
      }

      &[data-variant="secondary"] {
        @include variant($bg-color, $color);
      }

      &:active {
        background: var(--dropdown-item-background-active, #{$active-bg});
      }

      &:focus-visible,
      &:has(> :global(.trakt-link:focus-visible)) {
        outline: var(--border-thickness-xs) solid $outline-color;
      }
    }

    &[data-color="purple"] {
      @include color(
        var(--purple-800),
        var(--purple-200),
        var(--purple-800),
        var(--purple-50)
      );
    }

    &[data-color="red"] {
      @include color(
        var(--red-600),
        var(--red-200),
        var(--red-600),
        var(--red-50)
      );
    }

    &[data-color="blue"] {
      @include color(
        var(--blue-600),
        var(--blue-200),
        var(--blue-600),
        var(--blue-50)
      );
    }

    &[data-color="orange"] {
      @include color(
        var(--orange-600),
        var(--orange-200),
        var(--orange-600),
        var(--orange-50)
      );
    }

    &[data-color="default"] {
      @include color(
        var(--shade-700),
        var(--shade-200),
        var(--shade-700),
        var(--shade-50)
      );
    }
  }
</style>
