<script lang="ts">
  import GhostMascot from "../mascots/GhostMascot.svelte";
  import hillLargeUrl from "./assets/halloween-hill-2x.webp";
  import hillUrl from "./assets/halloween-hill.webp";
</script>

<div class="trakt-halloween-jack-o-lantern">
  <div class="lantern-scene">
    <div class="lantern-ghost">
      <div class="ghost-peek"><GhostMascot /></div>
    </div>
    <img
      class="lantern-image"
      src={hillUrl}
      srcset="{hillUrl} 1x, {hillLargeUrl} 2x"
      alt=""
      draggable="false"
    />
    <div class="lantern-flicker"></div>
  </div>
</div>

<style>
  .trakt-halloween-jack-o-lantern {
    --scene-width: calc(var(--centerpiece-size) * 4.4);

    position: relative;
    width: 100%;
    height: 100%;

    .lantern-scene {
      position: absolute;
      top: 50%;
      left: 50%;

      width: var(--scene-width);
      aspect-ratio: 1000 / 313;
      margin-top: calc(var(--scene-width) * -0.122);
      margin-left: calc(var(--scene-width) * -0.495);

      mask-image: linear-gradient(to bottom, black 84%, transparent 100%);
    }

    .lantern-ghost {
      position: absolute;
      top: 8%;
      left: 9%;

      width: 6.5%;
      height: 30%;

      transform: rotate(-9deg);
      transform-origin: 50% 100%;
    }

    .ghost-peek {
      width: 100%;
      aspect-ratio: 40 / 44;
      transform: translateY(160%);
      animation: ghost-peek 9s ease-in-out 2.5s infinite;
    }

    .lantern-image {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;

      user-select: none;
      pointer-events: none;
    }

    .lantern-flicker {
      position: absolute;
      top: 39%;
      left: 49.5%;

      width: 15%;
      aspect-ratio: 1;

      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--yellow-200) 40%, transparent) 0%,
        color-mix(in srgb, var(--orange-400) 18%, transparent) 45%,
        transparent 70%
      );
      transform: translate(-50%, -50%);

      pointer-events: none;
      animation: lantern-flicker 2.6s ease-in-out infinite;
    }
  }

  @keyframes ghost-peek {
    0%,
    30%,
    100% {
      transform: translateY(160%);
    }
    40%,
    52% {
      transform: translateY(84%) rotate(-6deg);
    }
    58%,
    70% {
      transform: translateY(80%) rotate(5deg);
    }
    80% {
      transform: translateY(160%);
    }
  }

  @keyframes lantern-flicker {
    0%,
    100% {
      opacity: 0.9;
    }
    20% {
      opacity: 0.4;
    }
    24% {
      opacity: 0.8;
    }
    52% {
      opacity: 0.55;
    }
    70% {
      opacity: 1;
    }
    74% {
      opacity: 0.35;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-jack-o-lantern .lantern-flicker {
      animation: none;
    }

    .trakt-halloween-jack-o-lantern .lantern-ghost {
      display: none;
    }
  }
</style>
