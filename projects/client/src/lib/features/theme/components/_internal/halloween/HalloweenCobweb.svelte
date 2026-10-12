<script lang="ts">
  const CORNER = { x: 80, y: 0 };
  const angles = [90, 108, 126, 144, 162, 180].map(
    (degrees) => (degrees * Math.PI) / 180,
  );
  const rings = [18, 34, 50, 66];

  const pointAt = (angle: number, radius: number) => ({
    x: CORNER.x + Math.cos(angle) * radius,
    y: CORNER.y + Math.sin(angle) * radius,
  });

  const spokes = angles
    .map((angle) => {
      const end = pointAt(angle, 78);
      return `M${CORNER.x} ${CORNER.y}L${end.x} ${end.y}`;
    })
    .join("");

  const threads = rings
    .map((radius) => {
      const points = angles.map((angle) => pointAt(angle, radius));
      const sags = points.slice(1).map((point, index) => {
        const mid = (angle(index) + angle(index + 1)) / 2;
        const control = pointAt(mid, radius * 0.86);
        return `Q${control.x} ${control.y} ${point.x} ${point.y}`;
      });
      const start = points.at(0);
      return start ? `M${start.x} ${start.y}${sags.join("")}` : "";
    })
    .join("");

  function angle(index: number) {
    return angles.at(index) ?? 0;
  }
</script>

<div class="trakt-halloween-cobweb" aria-hidden="true">
  <svg class="cobweb" viewBox="0 0 80 80">
    <path d={spokes + threads} />
  </svg>

  <div class="spider">
    <svg class="spider-figure" viewBox="0 0 24 20">
      <g class="spider-legs">
        <path d="M8 9 3 5 1 8M8 11 2 10 0 13M16 9l5-4 2 3M16 11l6-1 2 3" />
        <path d="M9 13 5 16 4 19M15 13l4 3 1 3" />
      </g>
      <circle class="spider-body" cx="12" cy="12" r="5" />
      <circle class="spider-body" cx="12" cy="6.5" r="3.5" />
      <circle class="spider-eye" cx="10.7" cy="6.2" r="1" />
      <circle class="spider-eye" cx="13.3" cy="6.2" r="1" />
    </svg>
  </div>
</div>

<style>
  .trakt-halloween-cobweb {
    position: fixed;
    top: 0;
    inset-inline-end: 0;

    width: var(--ni-104);
    height: var(--ni-104);

    pointer-events: none;
    z-index: var(--layer-floating);

    transform: scaleX(var(--rtl-sign));

    .cobweb {
      width: 100%;
      height: 100%;

      fill: none;
      stroke: var(--color-seasonal-silhouette);
      stroke-width: 0.6;
      opacity: 0.6;
    }

    .spider {
      position: absolute;
      top: var(--ni-24);
      right: var(--ni-32);

      width: var(--ni-20);
      height: var(--ni-16);

      animation: spider-dangle 9s ease-in-out infinite;

      &::before {
        content: "";
        position: absolute;
        bottom: 60%;
        left: 50%;

        width: var(--ni-1);
        height: 100vh;

        background-color: var(--color-seasonal-silhouette);
        opacity: 0.6;
      }

      .spider-figure {
        position: relative;
        width: 100%;
        height: 100%;
      }
    }

    .spider-legs {
      fill: none;
      stroke: var(--color-halloween-hat);
      stroke-width: 1.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .spider-body {
      fill: var(--color-halloween-hat);
    }

    .spider-eye {
      fill: var(--purple-300);
    }
  }

  @keyframes spider-dangle {
    0%,
    100% {
      transform: translateY(0);
    }
    40%,
    55% {
      transform: translateY(var(--ni-64));
    }
    48% {
      transform: translateY(calc(var(--ni-64) - var(--ni-6)));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-cobweb .spider {
      animation: none;
    }
  }
</style>
