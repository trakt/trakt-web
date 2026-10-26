<script lang="ts">
  import type { VipAchievement } from "../models/VipAchievement.ts";
  import AchievementPinShapes from "./AchievementPinShapes.svelte";
  import { achievementPins } from "./achievementPins.ts";
  import { pinPaths } from "./pinPaths.ts";

  const {
    achievement,
    hasShine = false,
    hasStuds = true,
  }: {
    achievement: VipAchievement;
    /** One sweep of light across the pin, for a fresh unlock. */
    hasShine?: boolean;
    /** Off for small pins, where the studs would only read as noise. */
    hasStuds?: boolean;
  } = $props();

  const STUD_GAP = 14;
  const ENAMEL_LIGHT =
    "color-mix(in srgb, var(--pin-color) 68%, var(--shade-10))";
  const ENAMEL_DARK =
    "color-mix(in srgb, var(--pin-color) 84%, var(--shade-1000))";
  const SILVER = [1, 2, 3, 4].map((n) => `var(--achievement-pin-silver-${n})`);
  const HOLO = [1, 2, 3, 4, 5].map((n) => `var(--achievement-pin-holo-${n})`);
  const SPARKLES = [
    pinPaths.sparkle(100, 16, 7),
    pinPaths.sparkle(16, 98, 4.5),
  ];

  const uid = $props.id();
  const metalGradients = [
    { id: `${uid}-metal`, x1: 0, y1: 0, x2: 100, y2: 100 },
    { id: `${uid}-bar`, x1: 30, y1: 0, x2: 90, y2: 0 },
  ];
  const pin = $derived(achievementPins[achievement.id]);
  const solid = $derived(pin.glyph.solid ?? pin.glyph.shapes);
  // A single-tier achievement has nothing to count, so it gets no stud bar.
  const showStuds = $derived(hasStuds && achievement.tierCount > 1);
  const glyphBox = $derived.by(() => {
    if (!hasStuds) return "translate(10 10) scale(1)";
    if (!showStuds) return "translate(20 10) scale(0.8)";
    return "translate(20 2) scale(0.8)";
  });
  const metal = $derived(achievement.isMaxed ? HOLO : SILVER);
  const barWidth = $derived(achievement.tierCount * STUD_GAP + 8);
  const barStart = $derived(60 - barWidth / 2);
  const studs = $derived(
    Array.from({ length: achievement.tierCount }, (_, index) => ({
      x: barStart + 11 + index * STUD_GAP,
      isLit: index <= achievement.tierIndex,
    })),
  );
</script>

<svg
  class="trakt-achievement-pin"
  viewBox="0 0 120 120"
  aria-hidden="true"
  style:--pin-color={`var(${pin.color})`}
>
  {#if achievement.isUnlocked}
    <defs>
      {#each metalGradients as gradient (gradient.id)}
        <linearGradient
          id={gradient.id}
          gradientUnits="userSpaceOnUse"
          x1={gradient.x1}
          y1={gradient.y1}
          x2={gradient.x2}
          y2={gradient.y2}
        >
          {#each metal as color, index (index)}
            <stop
              offset={index / (metal.length - 1)}
              style:stop-color={color}
            />
          {/each}
        </linearGradient>
      {/each}
      <linearGradient
        id={`${uid}-enamel`}
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="0"
        y2="100"
      >
        <stop offset="0" style:stop-color={ENAMEL_LIGHT} />
        <stop offset="0.6" style:stop-color="var(--pin-color)" />
        <stop offset="1" style:stop-color={ENAMEL_DARK} />
      </linearGradient>
      {#if hasShine}
        <mask
          id={`${uid}-shine`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="120"
          height="120"
        >
          <g transform={glyphBox}>
            <AchievementPinShapes shapes={solid} paint="white" grow={9} />
          </g>
        </mask>
      {/if}
    </defs>

    <g transform={glyphBox}>
      <g transform="translate(0 2.6)" opacity="0.3">
        <AchievementPinShapes
          shapes={solid}
          paint="var(--shade-1000)"
          grow={10}
        />
      </g>
      <AchievementPinShapes
        shapes={solid}
        paint={`url(#${uid}-metal)`}
        grow={9}
      />
      <AchievementPinShapes
        shapes={pin.glyph.shapes}
        paint={`url(#${uid}-enamel)`}
        maskId={`${uid}-knockout`}
      />
    </g>

    {#if showStuds}
      <g class="pin-studs">
        <rect
          x={barStart}
          y="99.5"
          width={barWidth}
          height="17"
          rx="8.5"
          opacity="0.25"
          style:fill="var(--shade-1000)"
        />
        <rect
          x={barStart}
          y="98"
          width={barWidth}
          height="17"
          rx="8.5"
          style:fill={`url(#${uid}-bar)`}
        />
        {#each studs as stud, index (index)}
          {#if stud.isLit}
            <circle
              cx={stud.x}
              cy="106.5"
              r="4.6"
              style:fill="var(--pin-color)"
            />
            <circle
              cx={stud.x}
              cy="106.5"
              r="4.6"
              fill="none"
              stroke-width="0.8"
              stroke-opacity="0.25"
              style:stroke="var(--shade-1000)"
            />
            <circle
              cx={stud.x - 1.5}
              cy="104.9"
              r="1.4"
              opacity="0.75"
              style:fill="var(--shade-10)"
            />
          {:else}
            <circle
              cx={stud.x}
              cy="106.5"
              r="4.4"
              opacity="0.42"
              style:fill="var(--shade-1000)"
            />
          {/if}
        {/each}
      </g>
    {/if}

    {#if achievement.isMaxed}
      {#each SPARKLES as d (d)}
        <path {d} style:fill="var(--shade-10)" />
      {/each}
    {/if}

    {#if hasShine}
      <g mask={`url(#${uid}-shine)`}>
        <g transform="skewX(-14)">
          <rect
            class="pin-shine"
            x="-40"
            y="0"
            width="34"
            height="120"
            opacity="0.55"
            style:fill="var(--shade-10)"
          />
        </g>
      </g>
    {/if}
  {:else}
    <g transform={glyphBox}>
      <g opacity="0.2">
        <AchievementPinShapes
          shapes={solid}
          paint="var(--shade-400)"
          grow={9}
        />
      </g>
      <g opacity="0.35">
        <AchievementPinShapes
          shapes={pin.glyph.shapes}
          paint="var(--shade-400)"
          maskId={`${uid}-knockout`}
        />
      </g>
    </g>
    {#if showStuds}
      <g class="pin-studs">
        <rect
          x={barStart}
          y="98"
          width={barWidth}
          height="17"
          rx="8.5"
          opacity="0.2"
          style:fill="var(--shade-400)"
        />
        {#each studs as stud, index (index)}
          <circle
            cx={stud.x}
            cy="106.5"
            r="4.4"
            opacity="0.35"
            style:fill="var(--shade-400)"
          />
        {/each}
      </g>
    {/if}
  {/if}
</svg>

<style lang="scss">
  .trakt-achievement-pin {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
  }

  // Studs fill in reading order, so right to left in RTL locales.
  .pin-studs:dir(rtl) {
    transform: scaleX(-1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @media (prefers-reduced-motion: no-preference) {
    .pin-shine {
      animation: pin-shine 700ms ease-out both;
      animation-delay: var(--pin-shine-delay, 0ms);
    }
  }

  @keyframes pin-shine {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(180px);
    }
  }
</style>
