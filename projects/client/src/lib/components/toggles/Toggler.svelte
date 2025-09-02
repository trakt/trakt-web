<script lang="ts" generics="T">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { writable } from "svelte/store";
  import Toggle from "./_internal/Toggle.svelte";
  import ToggleIcon from "./_internal/ToggleIcon.svelte";
  import type { ToggleOption } from "./ToggleOption.ts";

  interface TogglerProps {
    value: T;
    onChange: (value: T) => void;
    options: ToggleOption<T>[];
    class?: string;
    variant?: "icon" | "text";
  }

  const { value, onChange, options, variant = "icon" }: TogglerProps = $props();

  const trackerIndex = writable(
    options.findIndex((option) => value === option.value),
  );

  /*
    FIXME: for all keyframes in components, extract them as
    custom animation functions for use with svelte:animate
  */
  let trackerElement: HTMLDivElement;
  const handleChange = (index: number, optionValue: T) => {
    onChange(optionValue);
    trackerIndex.set(index);

    requestAnimationFrame(() => {
      trackerElement?.classList.add("moving");
    });
  };
</script>

<div
  class="trakt-toggler"
  role="group"
  data-dpad-navigation={DpadNavigationType.List}
  class:text-variant={variant === "text"}
>
  <div
    bind:this={trackerElement}
    class="tracker"
    style:--tracker-index={$trackerIndex}
    class:text-variant={variant === "text"}
    ontransitionend={(event) => {
      event.currentTarget.classList.remove("moving");
    }}
  ></div>
  {#each options as option, index (option.value)}
    <Toggle
      onclick={() => handleChange(index, option.value)}
      isPressed={$trackerIndex === index}
      {variant}
    >
      {#snippet icon()}
        <ToggleIcon {option} />
      {/snippet}

      {#if option.content}
        {@render option.content()}
      {:else}
        {option.text}
      {/if}
    </Toggle>
  {/each}
</div>

<style>
  .trakt-toggler {
    --toggler-animation-duration: calc(2 * var(--transition-increment));
    --toggle-animation-duration: var(--toggler-animation-duration);
    --toggle-animation-delay: var(--transition-increment);

    position: relative;

    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    border-radius: var(--border-radius-xxl);
    padding: var(--ni-4);
    background-color: var(--toggler-background-color);

    &.text-variant {
      --toggle-animation-delay: calc(0.75 * var(--transition-increment));
    }
  }

  .tracker {
    --scale-full-width: var(--toggle-small-width);
    --scale-intermediate-width: var(--toggle-small-width);
    --scale-transform: scaleX(1.1) scaleY(0.75);

    --tracker-offset: calc(var(--tracker-index) * var(--gap-xxs));
    --tracker-left: calc(var(--tracker-index) * var(--toggle-small-width));

    left: calc(var(--tracker-left) + var(--tracker-offset));
    margin-left: var(--ni-4);

    position: absolute;

    width: var(--toggle-small-width);
    height: var(--toggle-small-width);

    border-radius: var(--border-radius-xxl);
    background-color: var(--toggler-tracker-color);

    transition: var(--toggler-animation-duration) ease-in-out;
    transition-property: left, opacity;
    transform-origin: center;

    /* To let the browser optimize rendering for these transitions */
    will-change: transform, opacity, left, width;
    /* To force GPU acceleration */
    transform: translate3d(0, 0, 0);

    &:global(.moving) {
      animation: scaley-waley var(--toggler-animation-duration) ease-in-out
        forwards;
    }

    &.text-variant {
      --scale-transform: scale(1.25);
      --scale-full-width: var(--toggle-large-width);

      width: var(--toggle-large-width);
    }
  }
</style>
