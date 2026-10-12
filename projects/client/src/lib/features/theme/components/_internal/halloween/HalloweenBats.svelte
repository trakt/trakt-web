<script lang="ts">
  import BatSilhouette from "./BatSilhouette.svelte";

  const bats = [
    { key: "lead", delay: 2, duration: 26, scale: 1 },
    { key: "follower", delay: 3.2, duration: 26, scale: 0.7 },
    { key: "straggler", delay: 15, duration: 31, scale: 0.85 },
  ];
</script>

<div class="trakt-halloween-bats" aria-hidden="true">
  {#each bats as bat (bat.key)}
    <div
      class="bat"
      style="--flight-delay: {bat.delay}s; --flight-duration: {bat.duration}s; --bat-scale: {bat.scale}"
    >
      <BatSilhouette />
    </div>
  {/each}
</div>

<style>
  .trakt-halloween-bats {
    position: fixed;
    inset: 0;
    overflow: hidden;

    pointer-events: none;
    z-index: var(--layer-background);

    .bat {
      position: absolute;
      top: 0;
      left: 0;

      width: var(--ni-40);
      height: var(--ni-20);

      transform: translate(-20vw, 30vh);
      animation: bat-flight var(--flight-duration) linear infinite;
      animation-delay: var(--flight-delay);
    }
  }

  @keyframes bat-flight {
    0% {
      transform: translate(-10vw, 32vh) scale(var(--bat-scale));
    }
    12% {
      transform: translate(30vw, 14vh) scale(var(--bat-scale)) rotate(-6deg);
    }
    24% {
      transform: translate(70vw, 22vh) scale(var(--bat-scale)) rotate(4deg);
    }
    36% {
      transform: translate(115vw, 6vh) scale(var(--bat-scale));
    }
    100% {
      transform: translate(115vw, 6vh) scale(var(--bat-scale));
    }
  }
</style>
