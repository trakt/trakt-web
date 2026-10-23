<script lang="ts">
  import SplashScene from "../splash/SplashScene.svelte";
  import fogUrl from "./assets/halloween-fog.webp";
  import graveyardUrl from "./assets/halloween-graveyard.webp";
</script>

<SplashScene height="clamp(var(--ni-104), 18vw, var(--ni-200))">
  <div
    class="trakt-halloween-fog"
    style="--fog-image: url({fogUrl}); --graveyard-image: url({graveyardUrl})"
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

      width: max(100%, var(--ni-640));
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
        transform: scaleX(-1);
        animation-name: fog-drift-back;
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

  @keyframes fog-drift-back {
    from {
      transform: scaleX(-1) translateX(-6%);
    }
    to {
      transform: scaleX(-1) translateX(6%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-fog .fog-layer {
      animation: none;
    }
  }
</style>
