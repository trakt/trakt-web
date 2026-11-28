<script lang="ts">
  import { dayUnitLabel } from "../shared/dayUnitLabel.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import { releaseCountdown } from "../shared/releaseCountdown.ts";
  import { useNow } from "../shared/useNow.svelte.ts";
  import { sunMoonsGlyph } from "./sunMoonsGlyph.ts";
  import type { WormSign } from "./WormSign.ts";
  import type { WormStage } from "./WormStage.ts";

  const { wormSign }: { wormSign: WormSign } = $props();

  const STAGE_ATTRIBUTE = "data-dn3-stage";
  const TICKS = 12;
  const POLL = 120;

  const now = useNow({ period: 60_000 });
  const countdown = $derived(releaseCountdown(now.value));
  const days = $derived(countdown.calendarDays);
  const released = $derived(countdown.released);
  const glyph = sunMoonsGlyph();

  let lit = $state(0);
  let stage = $state<WormStage>("calm");

  $effect(() => {
    const root = document.documentElement;
    const current = { stage: "calm" as WormStage };
    const poll = () => {
      if (document.hidden) return;
      const reading = wormSign.read(performance.now());
      lit = Math.round(reading.level * TICKS);
      if (reading.stage === current.stage) return;
      current.stage = reading.stage;
      stage = reading.stage;
      root.setAttribute(STAGE_ATTRIBUTE, reading.stage);
    };
    const timer = setInterval(poll, POLL);
    root.setAttribute(STAGE_ATTRIBUTE, current.stage);
    return () => {
      clearInterval(timer);
      root.removeAttribute(STAGE_ATTRIBUTE);
    };
  });
</script>

<div class="dn3-chrome" aria-hidden="true">
  <div class="dn3-countdown">
    <span class="dn3-countdown-glyph">{@html glyph}</span>
    {#if released}
      <span class="dn3-countdown-number">{m.text_topic_dune_now()}</span>
    {:else}
      <span class="dn3-countdown-number">{days}</span>
      <span class="dn3-countdown-unit">
        {dayUnitLabel(days)}
      </span>
    {/if}
    <span class="dn3-countdown-rule"></span>
    <span class="dn3-countdown-date">{m.text_topic_dune_release_date()}</span>
  </div>

  <div class="dn3-meter" data-stage={stage}>
    <span class="dn3-meter-ticks">
      {#each Array.from({ length: TICKS }, (_, index) => TICKS - 1 - index) as tick (tick)}
        <i class:is-lit={tick < lit} class:is-hot={tick >= TICKS * 0.6}></i>
      {/each}
    </span>
    <span class="dn3-meter-trace"></span>
    <span class="dn3-meter-label">
      {stage === "worm"
        ? m.text_topic_dune_shai_hulud()
        : m.text_topic_dune_wormsign()}
    </span>
  </div>
</div>
