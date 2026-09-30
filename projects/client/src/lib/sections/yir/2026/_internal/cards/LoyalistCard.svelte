<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
  const lead = $derived(card.stats.at(0));
  const rest = $derived(card.stats.slice(1));
  const offset = $derived(289 * (1 - (card.share ?? 30) / 100));
</script>

<div class="root" class:is-live={live}>
  <div class="no">No. {card.number} · 2026</div>
  <div class="ring">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(216 180 106 / 25%)" stroke-width="2" />
      <circle class="arc" cx="50" cy="50" r="46" fill="none" stroke="#d8b46a" stroke-width="3" stroke-linecap="round" style="--offset: {offset}" />
    </svg>
    <div class="center"><b>{lead?.value}</b><span>{lead?.label}</span></div>
  </div>
  <div class="name">{card.name}</div>
  <div class="tag">{card.tagline}</div>
  <div class="stats">
    {#each rest as stat (stat.key)}
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
    background: radial-gradient(90% 70% at 50% 30%, #17634d, #0b2f25);
    color: #f6efdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 9cqw 8cqw 8cqw;
  }
  .root::before,
  .root::after {
    content: "";
    position: absolute;
    border: 0.35cqw solid #d8b46a;
    border-radius: 2cqw;
    pointer-events: none;
  }
  .root::before {
    inset: 3cqw;
  }
  .root::after {
    inset: 4.6cqw;
    opacity: 0.5;
  }
  .no {
    font-family: "Cormorant Garamond", "Cormorant Garamond Fallback", serif;
    font-size: 3.4cqw;
    letter-spacing: 0.35em;
    color: #d8b46a;
    text-transform: uppercase;
  }
  .ring {
    position: relative;
    width: 50cqw;
    aspect-ratio: 1;
    margin-top: 4cqw;
  }
  .ring svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  .arc {
    stroke-dasharray: 289;
    stroke-dashoffset: var(--offset);
  }
  .center {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    padding: 6cqw;
  }
  .center b {
    font-family: "Cormorant Garamond", "Cormorant Garamond Fallback", serif;
    font-weight: 600;
    font-size: 16cqw;
    line-height: 0.9;
  }
  .center span {
    font-family: "IBM Plex Sans", "IBM Plex Sans Fallback", sans-serif;
    font-size: 2.5cqw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #d8b46a;
    margin-top: 1cqw;
  }
  .name {
    font-family: "Cormorant Garamond", "Cormorant Garamond Fallback", serif;
    font-style: italic;
    font-weight: 600;
    font-size: 13cqw;
    line-height: 1;
    margin-top: 5cqw;
    background: linear-gradient(100deg, #b8914a 20%, #fff3cf 40%, #d8b46a 55%, #b8914a 80%);
    background-size: 250% 100%;
    background-clip: text;
    color: transparent;
  }
  .tag {
    font-family: "Cormorant Garamond", "Cormorant Garamond Fallback", serif;
    font-size: 4.8cqw;
    color: #e8dfc6;
    margin-top: 1cqw;
  }
  .stats {
    display: flex;
    justify-content: center;
    gap: 5cqw;
    margin-top: auto;
  }
  .stat b {
    font-family: "Cormorant Garamond", "Cormorant Garamond Fallback", serif;
    font-weight: 600;
    font-size: 7cqw;
  }
  .stat span {
    font-family: "IBM Plex Sans", "IBM Plex Sans Fallback", sans-serif;
    font-size: 2.4cqw;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #cdbf98;
  }
  .is-live .arc {
    animation: ring calc(var(--yir-beat) * 18) cubic-bezier(0.3, 0.7, 0.2, 1) both;
  }
  .is-live .name {
    animation: foil 4s ease-in-out infinite alternate;
  }
  @keyframes ring {
    from { stroke-dashoffset: 289; }
  }
  @keyframes foil {
    from { background-position: 100% 0; }
    to { background-position: 0 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
