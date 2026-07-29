<script lang="ts" generics="T">
  import { goto } from "$app/navigation";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import type { ToggleOption } from "./ToggleOption.ts";
  import type { TogglePillsProps } from "./TogglePillsProps.ts";

  const { value, onChange, options }: TogglePillsProps<T> = $props();

  const handleSelect = (option: ToggleOption<T>) => {
    onChange(option.value);

    // URL-driven toggles (e.g. discover mode, search mode) carry an href that
    // syncs the selection to a search param, mirroring Toggler's behaviour.
    if (option.href) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(option.href, {
        replaceState: true,
        keepFocus: true,
        noScroll: true,
      });
    }
  };
</script>

<div
  class="trakt-toggle-pills"
  role="group"
  data-dpad-navigation={DpadNavigationType.List}
>
  {#each options as option (option.value)}
    {@const isActive = option.value === value}
    <button
      type="button"
      class="pill"
      class:is-active={isActive}
      aria-label={option.label()}
      aria-pressed={isActive}
      data-dpad-navigation={DpadNavigationType.Item}
      onclick={() => handleSelect(option)}
    >
      {#if option.content}
        {@render option.content()}
      {:else}
        <span class="capitalize no-wrap" class:bold={isActive}>
          {option.text()}
        </span>
      {/if}
    </button>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-toggle-pills {
    display: flex;
    align-items: center;

    // Single row: the sub-header reserves one row's height, so a variable-length
    // option set (e.g. Extras video types) scrolls rather than wrapping.
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;

    gap: var(--gap-xs);

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .pill {
    // Filter language: outline pills. Selected mirrors the drawer's filter
    // confirmation (a check) and takes the filter blue accent on its stroke.
    all: unset;
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    flex-shrink: 0;

    padding: var(--ni-8) var(--ni-16);

    font-size: var(--font-size-text);
    line-height: var(--ni-20);

    border-radius: var(--border-radius-m);
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    // Unselected: ghost — transparent fill + a light 1px stroke (50% of the
    // foreground, i.e. ~50% white on the dark theme) so it reads light.
    background: transparent;
    color: var(--color-foreground);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 50%, transparent);

    transition: var(--transition-increment) ease-in-out;
    transition-property: color, box-shadow;

    &.is-active {
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--color-background-blue);
    }

    @include for-mouse {
      // Hovering an unselected pill previews the selection accent on the stroke.
      &:not(.is-active):hover {
        box-shadow: inset 0 0 0 var(--border-thickness-xxs)
          var(--color-background-blue);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-background-blue);
      outline-offset: var(--ni-2);
    }
  }
</style>
