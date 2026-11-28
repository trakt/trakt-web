<script lang="ts">
  import { dayUnitLabel } from "../shared/dayUnitLabel.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import { releaseCountdown } from "../shared/releaseCountdown.ts";
  import { useStinger } from "../shared/useStinger.svelte.ts";
  import { sandFront } from "./sandFront.ts";

  const DURATION = 1200;
  const ENTER = 560;
  const EXIT = 360;

  const { calendarDays: days, released } = releaseCountdown(Date.now());
  const stinger = useStinger({
    seenKey: "dune-stinger",
    holdFor: DURATION,
    exitFor: EXIT,
  });

  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas || stinger.calm) return;
    return sandFront({
      canvas,
      enterFor: ENTER,
      exitFor: EXIT,
      leftAt: stinger.leftAt,
    });
  });
</script>

{#if stinger.phase !== "idle"}
  <div
    class="dn3-stinger"
    class:is-leaving={stinger.phase === "leaving"}
    class:is-calm={stinger.calm}
    role="presentation"
    aria-hidden="true"
  >
    <div class="dn3-stinger-body">
      <div class="dn3-stinger-stage">
        <svg
          class="dn3-stinger-horizon"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dn3-stinger-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#c7834a" stop-opacity="0" />
              <stop offset=".16" stop-color="#c7834a" stop-opacity=".8" />
              <stop offset=".5" stop-color="#5a3219" stop-opacity=".35" />
              <stop offset="1" stop-color="#0b0806" stop-opacity="0" />
            </linearGradient>
          </defs>
          <rect width="1440" height="400" fill="url(#dn3-stinger-glow)" />
          <path
            d="M0 100C120 92 210 70 330 74s170 40 300 38 200-58 330-60 170 44 290 46 150-22 190-24V400H0z"
            fill="#100b08"
          />
          <path
            d="M0 100C120 92 210 70 330 74s170 40 300 38 200-58 330-60 170 44 290 46 150-22 190-24"
            fill="none"
            stroke="#e2b07a"
            stroke-opacity=".55"
            stroke-width="1.2"
          />
          <path
            d="M0 200C160 180 300 150 470 156s260 60 420 58 300-70 550-60V400H0z"
            fill="#080605"
          />
          <path d="M650 112h18v-122h-18zM682 112h10v-64h-10z" fill="#040303" />
        </svg>
        <div class="dn3-stinger-copy">
          <span class="dn3-stinger-kicker">
            {m.text_topic_dune_stinger_kicker()}
          </span>
          <span class="dn3-stinger-line">
            <span>{m.text_topic_dune_stinger_line_start()}</span>
            <span>{m.text_topic_dune_stinger_line_end()}</span>
          </span>
          {#if !released}
            <span class="dn3-stinger-days">
              <b>{days}</b>
              <span>
                {dayUnitLabel(days)} · {m.text_topic_dune_release_date()}
              </span>
            </span>
          {/if}
        </div>
      </div>
    </div>
    <canvas class="topic-layer" bind:this={canvas}></canvas>
  </div>
{/if}
