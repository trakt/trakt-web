<script lang="ts">
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { SNOW_CONFIG } from "./constants";
  import { generateSnowflake } from "./generateSnowflake";
  import { snowfall } from "./snowfall";

  let snowflakes = Array.from({ length: SNOW_CONFIG.count }).map(() =>
    generateSnowflake(),
  );

  const resetSnowflake = (index: number) => {
    snowflakes[index] = generateSnowflake(true);
  };

  onMount(() => {
    snowflakes = snowflakes.map((flake) => ({ ...flake, isVisible: true }));
  });
</script>

<div class="trakt-snow-frame" aria-hidden="true">
  {#each snowflakes as flake, i (i)}
    {#if flake.isVisible}
      <div
        class="trakt-snowflake"
        style={`transform: scale(${flake.scale}); left: ${flake.xEnd * 100}%`}
        in:snowfall={{
          delay: flake.delay,
          duration: flake.duration,
          scale: flake.scale,
          xStart: flake.xStart,
          xEnd: flake.xEnd,
        }}
        out:fade={{
          delay: SNOW_CONFIG.melting.delay,
          duration: SNOW_CONFIG.melting.duration,
          easing: cubicOut,
        }}
        on:introend={() => (flake.isVisible = false)}
        on:outroend={() => resetSnowflake(i)}
      >
        {flake.snowIcon}
      </div>
    {/if}
  {/each}
</div>

<style>
  .trakt-snow-frame {
    z-index: var(--layer-background);

    height: 100%;
    pointer-events: none;

    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    overflow: hidden;
  }

  .trakt-snowflake {
    --flake-size: var(--ni-18);

    color: var(--shade-10);
    text-shadow: 0 0 var(--ni-4) var(--shade-940);

    font-size: var(--flake-size);
    line-height: var(--flake-size);

    position: absolute;
    bottom: 0;
  }
</style>
