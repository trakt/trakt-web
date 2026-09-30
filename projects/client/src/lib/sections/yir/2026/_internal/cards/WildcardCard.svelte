<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  import type { YirPersonaId } from "$lib/requests/models/YirPersonaId";
  import { personaAccent } from "../persona/personaAccent";
  import { radarPoint } from "./radarPoint";
  import { radarPolygon } from "./radarPolygon";

  const RADIUS = 40;

  const AXES: ReadonlyArray<{ id: YirPersonaId; color: string }> = (
    [
      "anime-voyager",
      "day-one-devotee",
      "weekend-marathoner",
      "comfort-rewatcher",
      "omnivore",
      "opening-night",
      "cinephile",
      "critic",
      "loyalist",
      "curator",
    ] as const
  ).map((id) => ({ id, color: personaAccent(id) }));


  const { card, live }: PersonaCardProps = $props();
  const values = $derived(AXES.map(({ id }) => (card.scores[id] ?? 50) / 100));
  const dots = $derived(
    AXES.map((axis, index) => ({
      ...axis,
      ...radarPoint({
        radius: RADIUS * (values.at(index) ?? 0.5),
        index,
        count: AXES.length,
      }),
    })),
  );
</script>

<div class="root" class:is-live={live}>
  <div class="corner start" aria-hidden="true">W<small>★</small></div>
  <div class="corner end" aria-hidden="true">W<small>★</small></div>
  <div class="radar" aria-hidden="true">
    <svg viewBox="0 0 100 100">
      {#each [0.33, 0.66, 1] as step (step)}
        <polygon points={radarPolygon(AXES.map(() => RADIUS * step))} fill="none" stroke="rgb(26 26 46 / 20%)" stroke-width="0.5" />
      {/each}
      <g class="poly">
        <polygon points={radarPolygon(values.map((value) => RADIUS * value))} fill="rgb(194 37 92 / 16%)" stroke="#c2255c" stroke-width="1.2" stroke-linejoin="round" />
        {#each dots as dot, index (dot.id)}
          <circle class="dot" style="--i: {index}" cx={dot.x} cy={dot.y} r="2.8" style:fill={dot.color} stroke="#1a1a2e" stroke-width="0.6" />
        {/each}
      </g>
    </svg>
  </div>
  <div class="no">No. {card.number} · 2026</div>
  <div class="name">{card.name}</div>
  <div class="tag">{card.tagline}</div>
  <div class="stats">
    {#each card.stats as stat (stat.key)}
      <div class="stat"><b>{stat.value}</b><span>{stat.label}</span></div>
    {/each}
  </div>
</div>

<style lang="scss">
  .stat b,
  .stat span {
    display: block;
  }
  .root {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #f7f3ea;
    color: #1a1a2e;
    padding: 6cqw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .root::before {
    content: "";
    position: absolute;
    inset: 3cqw;
    border: 0.5cqw solid #1a1a2e;
    border-radius: 3cqw;
    pointer-events: none;
  }
  .corner {
    position: absolute;
    font-family: "Abril Fatface", "Abril Fatface Fallback", serif;
    font-size: 7cqw;
    line-height: 0.9;
    text-align: center;
  }
  .corner small {
    display: block;
    font-size: 4cqw;
    color: #c2255c;
  }
  .corner.start {
    top: 6cqw;
    inset-inline-start: 7cqw;
  }
  .corner.end {
    bottom: 6cqw;
    inset-inline-end: 7cqw;
    transform: rotate(180deg);
  }
  .radar {
    width: 56cqw;
    margin-top: 4cqw;
  }
  .radar svg {
    width: 100%;
    display: block;
    overflow: visible;
  }
  .poly {
    transform-box: view-box;
    transform-origin: 50px 50px;
  }
  .dot {
    transform-box: fill-box;
    transform-origin: center;
  }
  .no {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.6cqw;
    letter-spacing: 0.18em;
    color: #6b6b80;
    margin-top: 3cqw;
  }
  .name {
    font-family: "Abril Fatface", "Abril Fatface Fallback", serif;
    font-size: 11cqw;
    line-height: 1;
    margin-top: 1.5cqw;
  }
  .tag {
    font-size: 3.8cqw;
    color: #4a4a5e;
    margin-top: 1.5cqw;
    text-align: center;
    max-width: 64cqw;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2cqw;
    width: 100%;
    margin-top: auto;
    border-top: 0.4cqw solid #1a1a2e;
    padding: 2.5cqw 5cqw 0;
    text-align: center;
  }
  .stat b {
    font-family: "Abril Fatface", "Abril Fatface Fallback", serif;
    font-size: 6.4cqw;
  }
  .stat span {
    font-size: 2.7cqw;
    color: #55556a;
  }
  .is-live .poly {
    animation: radar calc(var(--yir-beat) * 14) cubic-bezier(0.3, 1.3, 0.5, 1) both;
  }
  .is-live .dot {
    animation: pop calc(var(--yir-beat) * 5) cubic-bezier(0.3, 1.6, 0.5, 1) both;
    animation-delay: calc(var(--yir-beat) * 8 + var(--i) * var(--yir-beat) * 0.7);
  }
  @keyframes radar {
    from { transform: scale(0) rotate(-40deg); }
  }
  @keyframes pop {
    from { transform: scale(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
