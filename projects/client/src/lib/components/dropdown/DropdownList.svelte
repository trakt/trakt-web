<script lang="ts">
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";
  import Button from "../buttons/Button.svelte";
  import DropdownIcon from "./DropdownCaretIcon.svelte";
  import type { TraktDropdownListProps } from "./TraktDropdownListProps.ts";

  const {
    onclick,
    icon: _icon,
    children,
    items,
    size,
    ...props
  }: TraktDropdownListProps = $props();
  const isDropdownOpen = writable(false);
</script>

<div
  class="trakt-dropdown-list-container"
  class:is-list-open={$isDropdownOpen}
  use:clickOutside
  onclickoutside={(e) => {
    isDropdownOpen.set(false);
  }}
  data-size={size}
>
  <Button
    onclick={(ev) => {
      isDropdownOpen.update((state) => !state);
      onclick?.(ev);
    }}
    style="textured"
    {...props}
  >
    {@render children()}
    {#snippet icon()}
      <div class="trakt-dropdown-list-icon">
        {#if _icon != null}
          {@render _icon()}
        {/if}
        <DropdownIcon open={$isDropdownOpen} disabled={props.disabled} />
      </div>
    {/snippet}
  </Button>

  {#if $isDropdownOpen}
    <div class="trakt-list" transition:slide={{ duration: 150 }}>
      <div class="spacer"></div>
      <ul onclickcapture={() => isDropdownOpen.set(false)}>
        {@render items()}
      </ul>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-dropdown-list-container {
    position: relative;
    padding: var(--ni-14);
    margin: var(--ni-neg-14);
    background: transparent;
    box-sizing: content-box;
    display: flex;

    :global(.trakt-button) {
      flex-grow: 1;
    }

    &[data-size="small"] {
      transform: scale(0.75);
      margin: var(--ni-neg-32);

      :global(li p) {
        font-size: var(--ni-16);
      }
    }

    &.is-list-open {
      z-index: 777;

      :global(.trakt-button) {
        z-index: 777;
      }

      .trakt-list {
        z-index: 776;
        opacity: 1;
      }

      .trakt-dropdown-list-icon {
        z-index: 777;
      }
    }

    .trakt-dropdown-list-icon {
      display: flex;
      gap: var(--ni-12);
    }

    :global(.trakt-button[disabled]:active) {
      :global(.trakt-dropdown-list-icon .trakt-dropdown-list-caret) {
        animation: loopy-loop var(--animation-duration-loopy-loop) infinite;
      }
    }

    ul {
      all: unset;

      display: grid;
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

    .trakt-list {
      --list-padding: var(--ni-12);

      z-index: -1;
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity var(--transition-increment) ease-in-out;

      padding: var(--list-padding) 0;
      border-radius: var(--border-radius-m);
      border-radius: var(--border-radius-m);

      background-color: var(--shade-10);

      div.spacer {
        height: calc(var(--ni-40) + var(--list-padding) * 2);
      }
    }
  }
</style>
