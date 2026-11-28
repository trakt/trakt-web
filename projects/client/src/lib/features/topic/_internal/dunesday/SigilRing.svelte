<script lang="ts">
  import { seededRandom } from "../shared/seededRandom.ts";

  const random = seededRandom(1218);
  const glyphs = Array.from({ length: 30 }, (_, index) => ({
    angle: index * 12,
    height: 4 + Math.round(random() * 8),
    notch: random() > 0.5,
  }));
  const ticks = Array.from({ length: 72 }, (_, index) => index * 5);
</script>

<svg class="dd-sigil" viewBox="-100 -100 200 200" aria-hidden="true">
  <circle r="97" fill="none" stroke="currentColor" stroke-width="1.6" />
  <g class="dd-sigil-ticks">
    {#each ticks as angle (angle)}
      <path
        d={angle % 30 === 0 ? "M0 -96 V-86" : "M0 -96 V-91"}
        transform={`rotate(${angle})`}
        stroke="currentColor"
        stroke-width="1.2"
      />
    {/each}
  </g>
  <circle
    r="80"
    fill="none"
    stroke="currentColor"
    stroke-width="5"
    stroke-dasharray="20 4 6 4"
    opacity="0.8"
  />
  <g class="dd-sigil-glyphs">
    {#each glyphs as glyph (glyph.angle)}
      <g transform={`rotate(${glyph.angle})`}>
        <rect
          x="-1.6"
          y={-70}
          width="3.2"
          height={glyph.height}
          fill="currentColor"
        />
        {#if glyph.notch}
          <rect
            x="-4.5"
            y={-70 + glyph.height + 2}
            width="9"
            height="2.2"
            fill="currentColor"
          />
        {/if}
      </g>
    {/each}
  </g>
  <circle r="48" fill="none" stroke="currentColor" stroke-width="1.2" />
  <path
    d="M0 -48 L41.6 24 L-41.6 24 Z M0 48 L-41.6 -24 L41.6 -24 Z"
    fill="none"
    stroke="currentColor"
    stroke-width="1.2"
    opacity="0.7"
  />
  <circle r="14" fill="currentColor" opacity="0.9" />
  <circle r="22" fill="none" stroke="currentColor" stroke-width="2" />
</svg>
