<script lang="ts">
  import { browser } from "$app/environment";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useDebouncedValue } from "$lib/stores/useDebouncedValue";
  import { time } from "$lib/utils/timing/time";
  import type { InputProps } from "./InputProps";

  const { children, input }: ChildrenProps & InputProps = $props();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);
  const isTouch = useMedia(WellKnownMediaQuery.touch);

  const isAvailableForMouse = $derived(input.includes("mouse"));
  const isAvailableForTouch = $derived(input.includes("touch"));

  const shouldRenderMouse = $derived(isAvailableForMouse && $isMouse);
  const shouldRenderTouch = $derived(isAvailableForTouch && $isTouch);

  const shouldRender = useDebouncedValue(time.seconds(1) / 60);

  $effect(() => {
    shouldRender.set(shouldRenderMouse || shouldRenderTouch);
  });
</script>

{#if !browser || $shouldRender}
  <trakt-render-for
    class:render-for-mouse={isAvailableForMouse && !browser}
    class:render-for-touch={isAvailableForTouch && !browser}
  >
    {@render children()}
  </trakt-render-for>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-render-for {
    display: contents;
  }

  .render-for-mouse {
    display: none;

    @include for-mouse {
      display: contents !important;
    }
  }

  .render-for-touch {
    display: none;

    @include for-touch {
      display: contents !important;
    }
  }
</style>
