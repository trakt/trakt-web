<script module lang="ts">
  let _itemCounter = 0;
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { Select } from "bits-ui";
  import type { Snippet } from "svelte";

  type DropdownItemProps = {
    color?: "red" | "purple" | "blue" | "orange" | "default";
    icon?: Snippet;
    style?: "ghost" | "flat";
    variant?: "primary" | "secondary";
    href?: string;
    noscroll?: boolean;
    replacestate?: boolean;
    label?: string;
    children: Snippet;
  } & HTMLElementProps;

  const {
    color = "purple",
    style = "ghost",
    variant = "primary",
    children,
    icon,
    disabled = false,
    href,
    noscroll = false,
    replacestate = false,
    label,
    onclick,
    ...rest
  }: DropdownItemProps = $props();

  const _id = ++_itemCounter;
  const itemValue = $derived(href ?? `item-${_id}`);

  function handleClick(event: MouseEvent) {
    if (href) {
      goto(href, { noScroll: noscroll, replaceState: replacestate });
    }
    onclick?.(event);
  }
</script>

<Select.Item
  value={itemValue}
  {label}
  {disabled}
  class="trakt-select-item"
  data-color={color}
  data-style={style}
  data-variant={variant}
  {...rest}
  onclick={handleClick}
>
  {#if icon}
    <div class="item-icon">
      {@render icon()}
    </div>
  {/if}
  <span class="ellipsis capitalize">{@render children()}</span>
</Select.Item>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  :global(.trakt-select-item) {
    .item-icon {
      display: flex;
      flex-shrink: 0;

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }
  }
</style>
