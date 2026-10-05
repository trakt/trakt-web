<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type {
    TodayStoryTapZone,
    TodayStoryTapZonesProps,
  } from "./TodayStoryTapZonesProps.ts";

  const { isFlipped, onTap, onPressStart, onPressEnd }: TodayStoryTapZonesProps =
    $props();

  const zones: ReadonlyArray<TodayStoryTapZone> = ["previous", "flip", "next"];

  const toLabel = (zone: TodayStoryTapZone) => {
    switch (zone) {
      case "previous":
        return m.button_label_previous_story();
      case "next":
        return m.button_label_next_story();
      case "flip":
        return isFlipped
          ? m.button_label_hide_details()
          : m.button_label_show_details();
    }
  };
</script>

{#each zones as zone (zone)}
  <button
    class="trakt-story-tap-zone"
    data-zone={zone}
    aria-label={toLabel(zone)}
    aria-pressed={zone === "flip" ? isFlipped : undefined}
    onclick={(event) => onTap(zone, event)}
    onpointerdown={onPressStart}
    onpointerup={onPressEnd}
    onpointercancel={onPressEnd}
    onpointerleave={onPressEnd}
  ></button>
{/each}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-story-tap-zone {
    --tap-gutter: calc((100cqw - 100%) / 2);
    --tap-edge: 25%;

    position: absolute;
    inset-block: 0;
    z-index: var(--layer-floating);

    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    @include for-touch {
      --tap-edge: 15%;
    }

    &[data-zone="previous"] {
      inset-inline-start: calc(-1 * var(--tap-gutter));
      width: calc(var(--tap-gutter) + var(--tap-edge));
    }

    &[data-zone="flip"] {
      inset-inline: var(--tap-edge);
    }

    &[data-zone="next"] {
      inset-inline-end: calc(-1 * var(--tap-gutter));
      width: calc(var(--tap-gutter) + var(--tap-edge));
    }
  }
</style>
