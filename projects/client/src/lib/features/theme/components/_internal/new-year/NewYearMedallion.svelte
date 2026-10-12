<script lang="ts">
  import LogoMarkCircle from "$lib/components/logo/LogoMarkCircle.svelte";

  const uid = $props.id();

  const CENTER = 100;

  const toPoint = (angle: number, radius: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return `${CENTER + radius * Math.cos(radians)} ${CENTER + radius * Math.sin(radians)}`;
  };

  const polygon = (sides: number, radius: number, offset: number) =>
    `M${Array.from({ length: sides }, (_, index) =>
      toPoint(offset + (index * 360) / sides, radius),
    ).join("L")}Z`;

  const fan = Array.from({ length: 36 }, (_, index) => {
    const angle = index * 10;
    return `M${toPoint(angle - 1.6, 90)}L${toPoint(angle, 112 + (index % 3 === 0 ? 14 : 0))}L${toPoint(angle + 1.6, 90)}Z`;
  }).join("");

  const steps = [0, 90, 180, 270]
    .map(
      (angle) =>
        `M${toPoint(angle - 9, 86)}L${toPoint(angle - 9, 92)}L${toPoint(angle - 5, 92)}L${toPoint(angle - 5, 97)}L${toPoint(angle + 5, 97)}L${toPoint(angle + 5, 92)}L${toPoint(angle + 9, 92)}L${toPoint(angle + 9, 86)}Z`,
    )
    .join("");

  const diamonds = [45, 135, 225, 315]
    .map(
      (angle) =>
        `M${toPoint(angle, 80)}L${toPoint(angle + 4, 88)}L${toPoint(angle, 96)}L${toPoint(angle - 4, 88)}Z`,
    )
    .join("");

  const outerFrame = polygon(8, 86, 22.5);
  const innerFrame = polygon(8, 79, 22.5);
</script>

<div class="trakt-new-year-medallion">
  <svg class="medallion-art" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <linearGradient id="{uid}-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" class="gold-light" />
        <stop offset="0.3" class="gold-mid" />
        <stop offset="0.5" class="gold-dark" />
        <stop offset="0.72" class="gold-light" />
        <stop offset="1" class="gold-deep" />
      </linearGradient>
      <radialGradient id="{uid}-night" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" class="night-light" />
        <stop offset="1" class="night-dark" />
      </radialGradient>
    </defs>

    <path class="medallion-fan" d={fan} fill="url(#{uid}-gold)" />

    <path class="medallion-plate" d={outerFrame} />
    <path class="medallion-frame" d={outerFrame} stroke="url(#{uid}-gold)" />
    <path
      class="medallion-frame is-thin"
      d={innerFrame}
      stroke="url(#{uid}-gold)"
    />
    <path d={steps} fill="url(#{uid}-gold)" />
    <path d={diamonds} fill="url(#{uid}-gold)" />

    <circle
      class="medallion-disc"
      cx="100"
      cy="100"
      r="66"
      fill="url(#{uid}-night)"
    />
    <circle
      class="medallion-ring"
      cx="100"
      cy="100"
      r="66"
      stroke="url(#{uid}-gold)"
    />
    <circle class="medallion-dots" cx="100" cy="100" r="59" />
  </svg>

  <div class="medallion-sheen"></div>

  <div class="medallion-mark"><LogoMarkCircle /></div>
</div>

<style>
  .trakt-new-year-medallion {
    position: relative;
    width: 100%;
    height: 100%;

    .medallion-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;

      filter: drop-shadow(
        0 0 var(--ni-16) color-mix(in srgb, var(--yellow-400) 45%, transparent)
      );
    }

    .gold-light {
      stop-color: var(--yellow-100);
    }

    .gold-mid {
      stop-color: var(--yellow-400);
    }

    .gold-dark {
      stop-color: var(--orange-600);
    }

    .gold-deep {
      stop-color: var(--orange-700);
    }

    .night-light {
      stop-color: var(--purple-800);
    }

    .night-dark {
      stop-color: var(--purple-1000);
    }

    .medallion-fan {
      opacity: 0.75;
      transform-origin: 100px 100px;
      animation: medallion-fan-spin 80s linear infinite;
    }

    .medallion-plate {
      fill: var(--purple-950);
    }

    .medallion-frame {
      fill: none;
      stroke-width: 3.5;
      stroke-linejoin: miter;

      &.is-thin {
        stroke-width: 1.2;
      }
    }

    .medallion-ring {
      fill: none;
      stroke-width: 3;
    }

    .medallion-dots {
      fill: none;
      stroke: var(--yellow-300);
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-dasharray: 0 6.18;
    }

    .medallion-sheen {
      position: absolute;
      inset: 17%;

      border-radius: 50%;
      background: linear-gradient(
        115deg,
        transparent 35%,
        color-mix(in srgb, var(--yellow-50) 35%, transparent) 50%,
        transparent 65%
      );
      background-size: 300% 100%;
      mix-blend-mode: screen;

      animation: medallion-sheen 4.5s ease-in-out 1.6s infinite both;
    }

    .medallion-mark {
      position: absolute;
      inset: 26%;

      --circle-mark-bg: transparent;
      --circle-mark-fill: var(--yellow-200);

      filter: drop-shadow(0 var(--ni-2) 0 var(--orange-800))
        drop-shadow(0 0 var(--ni-8) var(--yellow-400));

      :global(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }

  @keyframes medallion-fan-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes medallion-sheen {
    0%,
    55% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-new-year-medallion .medallion-fan,
    .trakt-new-year-medallion .medallion-sheen {
      animation: none;
    }
  }
</style>
