<script lang="ts">
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import Link from "../link/Link.svelte";

  type DropdownItemProps = {
    style?: "danger" | "normal";
    tabindex?: number;
  } & ChildrenProps &
    HTMLElementProps;

  type DropdownItemAnchorProps = DropdownItemProps & HTMLAnchorProps;

  const {
    style = "normal",
    children,
    ...props
  }: DropdownItemProps | DropdownItemAnchorProps = $props();

  const hasHandler = $derived(
    Object.keys(props).some((propName) => propName.startsWith("on")),
  );
  const tabIndex = $derived(hasHandler ? 0 : -1);
  const href = $derived((props as DropdownItemAnchorProps).href);
  const target = $derived((props as DropdownItemAnchorProps).target);
</script>

{#snippet text()}
  <p class="small bold uppercase ellipsis">{@render children()}</p>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<li use:triggerWithKeyboard tabindex={tabIndex} data-style={style} {...props}>
  {#if href}
    <Link {href} {target} color="inherit">
      {@render text()}
    </Link>
  {:else}
    <p class="small bold uppercase ellipsis">
      {@render text()}
    </p>
  {/if}
</li>

<style lang="scss">
  @use "../../../style/mixins/index" as *;

  li {
    text-decoration: none;
    list-style-type: none;
    user-select: none;

    padding: 0 var(--ni-12);
    height: calc(var(--ni-20) + var(--ni-12) * 2);
    width: calc(100% - var(--ni-48));
    border-radius: var(--border-radius-m);

    align-content: center;
    justify-self: center;

    cursor: pointer;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background color;

    :global(.trakt-link) {
      display: block;
      color: inherit;
      width: 100%;
      height: 100%;
      align-content: center;
    }

    &[data-style="normal"] {
      color: var(--purple-800);

      @include mouse {
        &:hover {
          background: var(--purple-100);
        }
      }

      &:active {
        background: var(--purple-200);
      }

      &:focus-visible,
      &:has(> :global(.trakt-link:focus-visible)) {
        outline: var(--border-thickness-xs) solid var(--purple-800);
      }
    }

    &[data-style="danger"] {
      color: var(--red-600);

      @include mouse {
        &:hover {
          background: var(--red-100);
        }
      }

      &:active {
        background: var(--red-200);
      }

      &:focus-visible,
      &:has(:global(.trakt-link:focus-visible)) {
        outline: var(--border-thickness-xs) solid var(--red-600);
      }
    }
  }
</style>
