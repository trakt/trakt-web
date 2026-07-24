<script lang="ts">
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import CheckIcon from "../icons/CheckIcon.svelte";
  import Link from "../link/Link.svelte";
  import type { OptionListItemProps } from "./_internal/OptionListItemProps.ts";

  const {
    title,
    description,
    icon,
    end,
    selected = false,
    ...props
  }: OptionListItemProps = $props();

  const hasHandler = $derived(
    Object.keys(props).some((propName) => propName.startsWith("on")),
  );
  const href = $derived((props as HTMLAnchorProps).href);
  const noscroll = $derived((props as HTMLAnchorProps).noscroll);
  const replacestate = $derived((props as HTMLAnchorProps).replacestate);
  const target = $derived((props as HTMLAnchorProps).target);
  const tabIndex = $derived(hasHandler ? 0 : -1);
  const itemRole = $derived(hasHandler && !href ? "button" : undefined);
</script>

{#snippet body()}
  {#if icon}
    <div class="item-icon">
      {@render icon()}
    </div>
  {/if}

  <div class="item-text">
    <span class="item-title ellipsis">{title}</span>
    {#if description}
      <span class="item-description secondary tag ellipsis">{description}</span>
    {/if}
  </div>

  {#if end}
    <div class="item-end">
      {@render end()}
    </div>
  {:else if selected}
    <div class="item-check">
      <CheckIcon />
    </div>
  {/if}
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<li
  class="trakt-option-list-item"
  class:is-selected={selected}
  use:triggerWithKeyboard
  role={itemRole}
  tabindex={tabIndex}
  {...props}
>
  {#if href}
    <Link {href} {noscroll} {replacestate} {target} color="inherit">
      {@render body()}
    </Link>
  {:else}
    {@render body()}
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-option-list-item {
    list-style-type: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    box-sizing: border-box;
    width: 100%;
    padding-block: var(--ni-14);
    padding-inline: var(--ni-16);

    color: var(--color-text-primary);
    transition: background var(--transition-increment) ease-in-out;

    &:not(:last-child) {
      border-block-end: var(--ni-1) solid var(--color-option-list-separator);
    }

    &.is-selected {
      background: var(--color-option-list-highlight);
    }

    @include for-mouse {
      &:hover {
        background: var(--color-option-list-highlight);
      }
    }

    &:focus-visible,
    &:has(> :global(.trakt-link:focus-visible)) {
      outline: var(--border-thickness-xs) solid var(--color-text-primary);
      outline-offset: calc(-1 * var(--border-thickness-xs));
    }

    :global(.trakt-link) {
      color: inherit;
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-s);

      width: 100%;
    }
  }

  .item-icon {
    display: flex;
    flex-shrink: 0;

    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .item-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .item-title {
    font-weight: 500;
    color: color-mix(in srgb, var(--color-text-primary) 78%, transparent);
  }

  .is-selected .item-title {
    color: var(--color-text-primary);
  }

  .item-check,
  .item-end {
    display: flex;
    flex-shrink: 0;
    margin-inline-start: auto;

    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .item-end {
    color: var(--color-text-secondary);
  }
</style>
