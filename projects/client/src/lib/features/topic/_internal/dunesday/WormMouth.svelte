<script lang="ts">
  import { toothRing } from "./toothRing.ts";

  const { id }: { id: string } = $props();

  const rings = [
    { radius: 90, count: 34, length: 17, width: 12, spin: "a" },
    { radius: 70, count: 26, length: 15, width: 11, spin: "b" },
    { radius: 51, count: 18, length: 13, width: 10, spin: "a" },
  ].map((ring) => ({ ...ring, path: toothRing(ring) }));

  const plates = Array.from({ length: 18 }, (_, index) => index * 20);
</script>

<svg class="dd-worm" viewBox="-100 -100 200 200" aria-hidden="true">
  <defs>
    <radialGradient id={`${id}-throat`}>
      <stop offset="0" stop-color="#2a5bd0" stop-opacity="0.85" />
      <stop offset="0.16" stop-color="#0a1430" />
      <stop offset="0.38" stop-color="#050302" />
      <stop offset="0.7" stop-color="#3b2412" />
      <stop offset="1" stop-color="#8a5a2e" />
    </radialGradient>
    <linearGradient id={`${id}-tooth`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff1d0" />
      <stop offset="0.6" stop-color="#e3b97a" />
      <stop offset="1" stop-color="#9c6a35" />
    </linearGradient>
  </defs>
  <circle r="99" fill="#5e3b1c" />
  <g class="dd-worm-plates">
    {#each plates as angle (angle)}
      <path
        d="M0 -99 A99 99 0 0 1 33.9 -93 L30 -84 A89 89 0 0 0 0 -89 Z"
        transform={`rotate(${angle})`}
        fill="#c08a4f"
        stroke="#2a180a"
        stroke-width="1.4"
      />
    {/each}
  </g>
  <circle r="89" fill={`url(#${id}-throat)`} />
  {#each rings as ring (ring.radius)}
    <g class="dd-worm-ring" data-spin={ring.spin}>
      <path
        d={ring.path}
        fill={`url(#${id}-tooth)`}
        stroke="#2a180a"
        stroke-width="0.8"
      />
    </g>
  {/each}
  <circle r="30" fill={`url(#${id}-throat)`} opacity="0.9" />
</svg>
