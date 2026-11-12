<script lang="ts">
  import CountUpBase from "$lib/components/counter/CountUp.svelte";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { time } from "$lib/utils/timing/time.ts";
  import { REVEAL_MARGIN } from "./REVEAL_MARGIN.ts";

  const DURATION = time.seconds(1.1);

  const {
    value,
    format,
  }: {
    value: number;
    format: (value: number) => string;
  } = $props();

  let isInView = $state(false);
  const formatRounded = (shown: number) => format(Math.round(shown));
</script>

<span
  class="trakt-month-review-count-up"
  data-final={format(value)}
  use:whenInViewport={{
    callback: () => (isInView = true),
    rootMargin: REVEAL_MARGIN,
  }}
>
  <span class="live">
    <CountUpBase
      {value}
      active={isInView}
      format={formatRounded}
      duration={DURATION}
    />
  </span>
</span>

<style lang="scss">
  .trakt-month-review-count-up {
    display: inline-grid;
    font: inherit;
    letter-spacing: inherit;
    font-variant-numeric: tabular-nums;

    &::after {
      content: attr(data-final);
      grid-area: 1 / 1;
      visibility: hidden;
    }
  }

  .live {
    grid-area: 1 / 1;
    font: inherit;
  }
</style>
