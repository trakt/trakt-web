<script lang="ts">
  import SplashScene from "../splash/SplashScene.svelte";
  import fogUrl from "./assets/halloween-fog.webp";
  import graveyardLargeUrl from "./assets/halloween-graveyard-2x.webp";
  import graveyardUrl from "./assets/halloween-graveyard.webp";
</script>

<SplashScene height="clamp(var(--ni-104), 18vw, var(--ni-200))">
  <div
    class="trakt-halloween-fog"
    style="--fog-image: url({fogUrl}); --graveyard-image: image-set(url({graveyardUrl}) 1x, url({graveyardLargeUrl}) 2x)"
  >
    <div class="fog-graveyard"></div>
    <div class="fog-layer is-back"></div>
    <div class="fog-layer"></div>
  </div>
</SplashScene>

<style>
  .trakt-halloween-fog {
    position: absolute;
    inset: 0;
    overflow-x: clip;

    .fog-graveyard {
      position: absolute;
      bottom: 0;
      left: 50%;

      width: max(min(100%, 180vh), var(--ni-640));
      aspect-ratio: 1200 / 329;

      background: var(--graveyard-image) center / 100% 100% no-repeat;
      opacity: 0.4;
      transform: translateX(-50%);
    }

    .fog-layer {
      position: absolute;
      bottom: 0;
      left: -10%;

      width: 120%;
      height: 85%;

      background: var(--fog-image) bottom center / 100% 100% no-repeat;
      opacity: 0.55;

      animation: fog-drift 24s ease-in-out infinite alternate;

      &.is-back {
        height: 100%;
        opacity: 0.3;
        scale: -1 1;
        animation-duration: 32s;
      }
    }
  }

  @keyframes fog-drift {
    from {
      transform: translateX(-6%);
    }
    to {
      transform: translateX(6%);
    }
  }

  @media (min-aspect-ratio: 2 / 1) {
    .trakt-halloween-fog .fog-graveyard {
      mask-image: linear-gradient(
        to right,
        transparent,
        black 8%,
        black 92%,
        transparent
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-fog .fog-layer {
      animation: none;
    }
  }
</style>
