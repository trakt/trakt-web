<script lang="ts">
  const STAR_COUNT = 8;
  const STAR_ORBIT = 55;

  const stars = Array.from({ length: STAR_COUNT }, (_, index) => {
    const angle = (index / STAR_COUNT) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + Math.cos(angle) * STAR_ORBIT,
      y: 50 + Math.sin(angle) * STAR_ORBIT,
      delay: (index / STAR_COUNT) * 2.4,
    };
  });
</script>

<span class="aura-slot">
  <span class="elite-glow"></span>
  <span class="elite-crest turns-forward">
    <span class="crest-plate"></span>
  </span>
  <span class="elite-crest turns-back">
    <span class="crest-plate is-turned"></span>
  </span>
  <span class="elite-backing"></span>
  <span class="elite-orbit">
    {#each stars as star, index (index)}
      <span
        class="elite-star"
        style:inset-inline-start="{star.x}%"
        style:inset-block-start="{star.y}%"
        style:--star-delay="{star.delay}s"
      >
        <span class="star-shape"></span>
      </span>
    {/each}
  </span>
</span>

<style lang="scss">
  @use "./aura" as *;

  .aura-slot {
    @include slot(15);
  }

  .elite-glow {
    @include layer(-24);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--aura-mid) 60%, transparent) 0%,
      transparent 60%
    );

    @include motion {
      animation: tier-aura-breathe 4s ease-in-out infinite;
    }
  }

  .elite-crest {
    @include layer(12);
    border-radius: 0;

    &.turns-forward {
      @include motion {
        animation: tier-aura-spin 28s linear infinite;
      }
    }

    &.turns-back {
      @include motion {
        animation: tier-aura-spin-back 28s linear infinite;
      }
    }
  }

  .crest-plate {
    position: absolute;
    inset: 0;
    border-radius: 24%;
    background: linear-gradient(
      135deg,
      var(--aura-light) 0%,
      var(--aura-mid) 35%,
      var(--aura-deep) 70%,
      var(--aura-mid) 100%
    );
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--aura-light) 50%, transparent);

    &.is-turned {
      opacity: 0.85;
      transform: rotate(45deg);
      background: linear-gradient(
        315deg,
        var(--aura-light) 0%,
        var(--aura-mid) 35%,
        var(--aura-deep) 70%,
        var(--aura-mid) 100%
      );
    }
  }

  .elite-backing {
    @include layer(11);
    background: var(--tier-aura-surface, var(--color-background));
  }

  .elite-orbit {
    @include layer(0);

    @include motion {
      animation: tier-aura-spin 40s linear infinite;
    }
  }

  .elite-star {
    position: absolute;
    inline-size: calc(var(--u) * 9);
    block-size: calc(var(--u) * 9);
    translate: calc(var(--rtl-sign, 1) * -50%) -50%;
  }

  .star-shape {
    position: absolute;
    inset: 0;
    background: var(--aura-white);
    clip-path: $spark;
    filter: drop-shadow(0 0 calc(var(--u) * 3) var(--aura-light))
      drop-shadow(0 0 calc(var(--u) * 6) var(--aura-mid));

    @include motion {
      animation: tier-aura-twinkle 2.4s ease-in-out var(--star-delay) infinite;
    }
  }
</style>
