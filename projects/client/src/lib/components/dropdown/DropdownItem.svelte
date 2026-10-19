<script lang="ts">
  import { disableNavigation } from "$lib/utils/actions/disableNavigation";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import type { Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type DropdownItemProps = {
    color?: "red" | "default";
    tabindex?: number;
    icon?: Snippet;
    end?: Snippet;
    subtitle?: Snippet;
    subtitleSize?: "small" | "tag";
    selected?: boolean;
  } & ChildrenProps &
    HTMLElementProps;

  type DropdownItemAnchorProps = DropdownItemProps & HTMLAnchorProps;

  const {
    color = "default",
    selected = false,
    children,
    icon,
    end,
    subtitle,
    subtitleSize = "small",
    ...props
  }: DropdownItemProps | DropdownItemAnchorProps = $props();

  const hasHandler = $derived(
    Object.keys(props).some((propName) => propName.startsWith("on")),
  );
  const href = $derived((props as DropdownItemAnchorProps).href);
  const tabIndex = $derived(hasHandler && !href ? 0 : -1);
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
      <p class="item-subtitle {subtitleSize} secondary ellipsis">
        {@render subtitle()}
      </p>
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
    --item-padding-block: var(--ni-14);
    --item-padding-inline: var(--ni-16);

    text-decoration: none;
    list-style-type: none;
    user-select: none;

    padding: var(--item-padding-block) var(--item-padding-inline);
    width: 100%;
    box-sizing: border-box;

    align-content: center;
    justify-self: center;

    display: flex;
    align-items: center;
    gap: var(--icon-gap);

    color: var(--color-text-primary);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background, color;

    &:not(:last-child) {
      border-block-end: var(--ni-1) solid var(--color-option-list-separator);
    }

    .item-label {
      min-width: 0;

      .item-subtitle {
        color: var(--color-text-secondary);
      }
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

    @include for-mouse {
      &:hover:not([disabled="true"]) {
        background: var(--color-select-item-hover);
      }
    }

    &:active {
      background: var(--color-select-item-hover);
    }

    &.is-selected {
      background: var(--color-option-list-selected);

      @include for-mouse {
        &:hover:not([disabled="true"]) {
          background: var(--color-option-list-selected-hover);
        }
      }

      &:active {
        background: var(--color-option-list-selected-hover);
      }
    }

    &[data-color="red"] {
      color: var(--red-600);
    }

    &:focus-visible,
    &:has(> :global(.trakt-link:focus-visible)) {
      outline: var(--border-thickness-xs) solid currentColor;
    }

    &:active[disabled="true"] {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &[disabled="true"] {
      color: var(--color-text-secondary);
      cursor: not-allowed;
    }

    &:has(> :global(.trakt-link)) {
      padding: 0;
    }

    :global(.trakt-link) {
      color: inherit;

      width: 100%;
      height: 100%;
      padding: var(--item-padding-block) var(--item-padding-inline);
      box-sizing: border-box;

      display: flex;
      align-items: center;
      gap: var(--icon-gap);

      text-decoration: none;
    }
  }
</style>
