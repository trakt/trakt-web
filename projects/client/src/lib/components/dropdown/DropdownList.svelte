<script lang="ts">
  import { usePortal } from "$lib/features/portal/usePortal.ts";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver.ts";
  import { getDeviceType } from "$lib/utils/devices/getDeviceType.ts";
  import { slide } from "svelte/transition";
  import Button from "../buttons/Button.svelte";
  import DropdownIcon from "./DropdownCaretIcon.svelte";
  import type { TraktDropdownListProps } from "./TraktDropdownListProps.ts";

  const {
    icon: _icon,
    children,
    items,
    preferNative = false,
    size,
    navigationType,
    ...props
  }: TraktDropdownListProps = $props();

  const deviceType = $derived(getDeviceType(navigator.userAgent));
  const isNativeTarget = $derived(deviceType === "mobile");
  const isActuallyNative = $derived(preferNative && isNativeTarget);

  const { portalTrigger, portal, isOpened } = $derived(
    usePortal({ disabled: isActuallyNative }),
  );

  const { observedDimension, observeDimension } = useDimensionObserver("width");

  function buildOptionList(element: HTMLElement) {
    const list = Array.from(element.querySelectorAll("li"));

    return list.map((item, index) => {
      item.setAttribute("data-index", index.toString());

      const option = document.createElement("option");
      option.setAttribute("data-index", index.toString());
      option.innerText =
        item.innerText.charAt(0).toUpperCase() +
        item.innerText.toLowerCase().slice(1);

      return option;
    });
  }

  function buildSelect(element: HTMLElement) {
    const select = document.createElement("select");
    select.classList.add("trakt-shadow-select");
    select.setAttribute("tabindex", "-1");

    navigationType &&
      select.setAttribute("data-dpad-navigation", navigationType);

    select.addEventListener("change", (event) => {
      const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;

      const item = element.querySelector<HTMLElement>(
        `li[data-index="${selectedIndex}"]`,
      );

      if (item) {
        item.click();
      }
    });

    return select;
  }

  function shadowNativeSelect(element: HTMLElement) {
    const container =
      element.querySelector<HTMLElement>(`ul.trakt-shadow-list`);
    if (!container) return;

    const select = buildSelect(container);

    function appendOptions() {
      select.innerHTML = "";
      buildOptionList(element).forEach((option) => {
        select.appendChild(option);
      });
    }

    // Initial population
    appendOptions();

    const observer = new MutationObserver(() => {
      appendOptions();
    });

    observer.observe(container, { childList: true, subtree: true });

    element.appendChild(select);

    return {
      destroy() {
        observer.disconnect();
        select.remove();
      },
    };
  }

  const buttonNavigationType = $derived(
    !isActuallyNative && navigationType ? navigationType : undefined,
  );
</script>

<div
  class="trakt-dropdown-wrapper"
  use:portalTrigger
  use:observeDimension
  use:shadowNativeSelect
  data-size={size}
>
  <Button
    style="textured"
    navigationType={buttonNavigationType}
    {size}
    {...props}
  >
    {@render children()}
    {#snippet icon()}
      <div class="trakt-dropdown-list-icon">
        {#if _icon != null}
          {@render _icon()}
        {:else}
          <DropdownIcon open={$isOpened} disabled={props.disabled} />
        {/if}
      </div>
    {/snippet}
  </Button>

  {#if isActuallyNative}
    <ul class="trakt-shadow-list">
      {@render items()}
    </ul>
  {/if}
</div>

{#if $isOpened && !isActuallyNative}
  <div
    class="trakt-list"
    data-size={size}
    style="--button-width: {$observedDimension}px"
    transition:slide={{ duration: 150 }}
    use:portal
  >
    <div class="spacer"></div>
    <ul>
      {@render items()}
    </ul>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-dropdown-wrapper {
    position: relative;
    display: flex;

    :global(.trakt-button) {
      flex-grow: 1;
    }

    .trakt-shadow-list {
      display: none;
      width: 0;
      height: 0;
      overflow: hidden;
    }

    //FIXME: merge with SelectFilter
    &:has(:global(select:focus-visible)) {
      outline: var(--border-thickness-xs) solid var(--purple-500);
      outline-offset: var(--border-thickness-xs);
      border-radius: calc(var(--border-radius-m) * 0.76925);
    }

    :global(.trakt-shadow-select) {
      z-index: var(--layer-raised);
      position: absolute;
      width: 100%;
      height: 100%;

      border: none;
      background-color: transparent;
      appearance: none;

      font-size: var(--font-size-text);

      cursor: pointer;
      opacity: 0;
    }

    &[data-size="small"] {
      :global(.trakt-button) {
        min-width: fit-content;
      }

      .trakt-dropdown-list-icon {
        :global(.trakt-dropdown-caret) {
          width: var(--ni-12);
          height: var(--ni-12);
        }
      }
    }

    &:global([data-popup-state="opened"]) {
      :global(.trakt-dropdown-caret) {
        transform: rotate(180deg);
        animation: rotate-180 var(--transition-increment) ease-in;
      }
    }

    .trakt-dropdown-list-icon {
      display: flex;
      gap: var(--gap-s);
    }

    :global(.trakt-button[disabled]:active) {
      :global(.trakt-dropdown-list-icon .trakt-dropdown-list-caret) {
        animation: loopy-loop var(--animation-duration-loopy-loop) infinite;
      }
    }
  }

  @mixin transform-position($list-padding) {
    --negative-offset: calc(-1 * #{$list-padding});

    transform: translateY(var(--negative-offset));

    &:global([data-popup-position="left"]) {
      transform: translateY(var(--negative-offset)) translateX($list-padding);
    }

    &:global([data-popup-position="right"]) {
      transform: translateY(var(--negative-offset))
        translateX(var(--negative-offset));
    }
  }

  .trakt-list {
    --list-padding: var(--ni-12);
    @include transform-position(var(--list-padding));

    position: absolute;
    width: max(var(--button-width), var(--ni-180));
    padding: var(--list-padding);

    border-radius: var(--border-radius-m);
    background-color: var(--shade-10);
    box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 25%, transparent);

    div.spacer {
      height: calc(var(--ni-40) + var(--list-padding) * 2);
    }

    ul {
      all: unset;

      display: grid;
      grid-template-columns: 100%;

      gap: var(--gap-xxs);
      max-height: var(--ni-220);
      overflow-y: auto;

      @include for-mouse {
        &::-webkit-scrollbar {
          width: var(--ni-8);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--shade-300);
          border-radius: var(--border-radius-xs);
          backdrop-filter: blur(var(--ni-4));
        }
      }
    }

    &[data-size="small"] {
      // TODO change back to transform scale when scaling is fixed
      --small-padding: var(--ni-10);
      @include transform-position(var(--small-padding));

      padding: var(--small-padding);

      :global(li) {
        padding: 0 var(--small-padding);
        height: calc(var(--ni-16) + var(--small-padding) * 2);
        width: calc(100% - var(--small-padding) * 2);
      }

      :global(li p) {
        font-size: var(--font-size-text);
      }

      div.spacer {
        height: calc(var(--ni-32) + var(--small-padding) * 2);
      }
    }
  }
</style>
