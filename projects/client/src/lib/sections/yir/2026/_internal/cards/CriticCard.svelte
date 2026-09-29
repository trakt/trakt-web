<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
  const fill = $derived(`${Math.round(((card.rating ?? 7) / 10) * 100)}%`);
</script>

<div class="root" class:is-live={live}>
  <div class="mast" aria-hidden="true">The Trakt Review</div>
  <div class="date" aria-hidden="true"><span>YEAR-END EDITION</span><span>No. {card.number}</span><span>2026</span></div>
  <div class="kick" aria-hidden="true">VERDICT</div>
  <div class="name">{card.name}</div>
  <div class="stars" style="--fill: {fill}" aria-hidden="true">★★★★★<span>★★★★★</span></div>
  <div class="quote">“{card.tagline}”</div>
  <div class="stamp" aria-hidden="true">FILED</div>
  <div class="cols">
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
    background: #f3eee2;
    color: #1b1a17;
    padding: 6cqw;
    display: flex;
    flex-direction: column;
  }
  .mast {
    text-align: center;
    font-family: "Playfair Display", serif;
    font-weight: 900;
    font-size: 7.6cqw;
    border-top: 1.2cqw double #1b1a17;
    padding-top: 2cqw;
  }
  .date {
    display: flex;
    justify-content: space-between;
    font-family: "JetBrains Mono", monospace;
    font-size: 2.4cqw;
    letter-spacing: 0.1em;
    border-block: 0.3cqw solid #1b1a17;
    padding: 1cqw 0;
    margin-top: 1.6cqw;
  }
  .kick {
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 700;
    font-size: 2.8cqw;
    letter-spacing: 0.3em;
    color: #b3261e;
    margin-top: 5cqw;
  }
  .name {
    font-family: "Playfair Display", serif;
    font-weight: 900;
    font-size: 15cqw;
    line-height: 0.9;
  }
  .stars {
    position: relative;
    align-self: flex-start;
    font-size: 8.5cqw;
    letter-spacing: 0.6cqw;
    line-height: 1;
    margin-top: 3cqw;
    color: #d8cfbb;
  }
  .stars span {
    position: absolute;
    inset: 0;
    color: #b3261e;
    clip-path: inset(0 calc(100% - var(--fill)) 0 0);
  }
  .quote {
    font-family: "Playfair Display", serif;
    font-style: italic;
    font-size: 4.6cqw;
    line-height: 1.25;
    border-inline-start: 1cqw solid #b3261e;
    padding-inline-start: 3cqw;
    margin-top: 4cqw;
  }
  .stamp {
    position: absolute;
    top: 34cqw;
    inset-inline-end: 6cqw;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 700;
    font-size: 3cqw;
    letter-spacing: 0.2em;
    color: #b3261e;
    border: 0.6cqw solid #b3261e;
    border-radius: 1cqw;
    padding: 1cqw 2cqw;
    transform: rotate(12deg);
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: auto;
    border-top: 0.3cqw solid #1b1a17;
    padding-top: 2.5cqw;
  }
  .stat {
    padding-inline: 2cqw;
  }
  .stat:first-child {
    padding-inline-start: 0;
  }
  .stat + .stat {
    border-inline-start: 0.3cqw solid #1b1a17;
  }
  .stat b {
    font-family: "Playfair Display", serif;
    font-weight: 900;
    font-size: 7.4cqw;
  }
  .stat span {
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 2.7cqw;
    color: #55503f;
  }
  .is-live .stars span {
    animation: fill-stars calc(var(--yir-beat) * 16) cubic-bezier(0.3, 0.7, 0.2, 1) calc(var(--yir-beat) * 3) both;
  }
  .is-live .stamp {
    animation: stamp calc(var(--yir-beat) * 4.5) cubic-bezier(0.3, 1.6, 0.5, 1) calc(var(--yir-beat) * 17) both;
  }
  @keyframes fill-stars {
    from { clip-path: inset(0 100% 0 0); }
  }
  @keyframes stamp {
    from { transform: rotate(12deg) scale(2.4); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
