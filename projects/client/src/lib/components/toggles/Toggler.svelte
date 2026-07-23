<script lang="ts" generics="T">
  import { goto } from "$app/navigation";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
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

  // Tooltips are a pointer affordance only - on touch the tap selects the
  // option, so gating on mouse keeps the tooltip from firing on tap.
  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const trackerIndex = $derived(
    writable(options.findIndex((option) => value === option.value)),
  );

  /*
    FIXME: for all keyframes in components, extract them as
    custom animation functions for use with svelte:animate
  */
  let trackerElement: HTMLDivElement;
  let pending = $state<{ index: number; href?: string } | null>(null);

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
    false;

  const commit = () => {
    if (!pending) return;

    const { index, href } = pending;
    pending = null;

    onChange(options.at(index)?.value ?? value);

    if (href) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(href, { replaceState: true, keepFocus: true, noScroll: true });
    }
  };

  const handleChange = (index: number, href?: string) => {
    pending = { index, href };
    trackerIndex.set(index);

    // With reduced motion the tracker transition is 0ms, so transitionend
    // never fires - commit immediately instead of waiting for it.
    if (prefersReducedMotion()) {
      commit();
      return;
    }

    trackerElement?.classList.add("moving");
  };

  const handleTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName === "opacity" || !pending) return;

    (event.currentTarget as HTMLDivElement).classList.remove("moving");
    commit();
  };

  const getTriggerProps = (option: ToggleOption<T>, index: number) => {
    if (option.href) {
      return {
        href: option.href,
        mode: "prevent" as const,
        onclick: (resolvedHref: string) => handleChange(index, resolvedHref),
      };
    }

    return {
      onclick: () => handleChange(index),
    };
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
    ontransitionend={handleTransitionEnd}
  ></div>
  {#each options as option, index (option.value)}
    <Tooltip
      content={option.text()}
      variant="compact"
      disabled={!$isMouse || variant === "text"}
    >
      <Toggle
        isPressed={$trackerIndex === index}
        label={option.label()}
        {variant}
        {...getTriggerProps(option, index)}
      >
        {#snippet icon()}
          <ToggleIcon {option} />
        {/snippet}

        {#if option.content}
          {@render option.content()}
        {:else}
          {option.text()}
        {/if}
      </Toggle>
    </Tooltip>
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
    border: var(--border-thickness-xxs) solid
      var(--color-flat-border-if-reduced, transparent);
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
    --tracker-inline-start: calc(
      var(--tracker-index) * var(--toggle-small-width)
    );
    --tracker-animation-duration: calc(
      var(--toggler-animation-duration) + var(--toggle-animation-delay)
    );

    inset-inline-start: calc(
      var(--tracker-inline-start) + var(--tracker-offset)
    );
    margin-inline-start: var(--ni-4);

    position: absolute;

    width: var(--toggle-small-width);
    height: var(--toggle-small-width);

    border-radius: var(--border-radius-xxl);
    background-color: var(--toggler-tracker-color);

    transition: var(--tracker-animation-duration) ease-in-out;
    transition-property: inset-inline-start, opacity;
    transform-origin: center;

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
