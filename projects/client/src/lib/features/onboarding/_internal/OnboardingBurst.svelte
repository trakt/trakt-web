<script lang="ts">
  const {
    radius,
    count = 8,
  }: {
    radius: string;
    count?: number;
  } = $props();

  const particles = $derived(
    Array.from({ length: count }, (_, index) => ({
      index,
      angle: (360 / count) * index,
      delay: `${(index % 3) * 40}ms`,
      scale: index % 2 === 0 ? 1 : 0.7,
    })),
  );
</script>

<span class="trakt-onboarding-burst" aria-hidden="true">
  {#each particles as particle (particle.index)}
    <span
      class="burst-particle"
      style:--burst-angle="{particle.angle}deg"
      style:--burst-radius={radius}
      style:--burst-delay={particle.delay}
      style:--burst-scale={particle.scale}
    ></span>
  {/each}
</span>

<style>
  .trakt-onboarding-burst {
    --burst-color: var(--color-accent-purple);
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .burst-particle {
    position: absolute;
    top: 50%;
    inset-inline-start: 50%;
    width: var(--ni-4);
    height: var(--ni-4);
    margin: calc(var(--ni-4) / -2);
    border-radius: 50%;
    background: var(--burst-color);
    opacity: 0;
    transform: rotate(var(--burst-angle)) translateY(0) scale(0);
    animation: onboarding-burst 650ms cubic-bezier(0.2, 0.8, 0.2, 1)
      var(--burst-delay) both;
  }

  @keyframes onboarding-burst {
    0% {
      opacity: 1;
      transform: rotate(var(--burst-angle)) translateY(0) scale(0);
    }
    55% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: rotate(var(--burst-angle))
        translateY(calc(var(--burst-radius) * -1)) scale(var(--burst-scale));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .burst-particle {
      animation: none;
    }
  }
</style>
