<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="osd" aria-hidden="true"><span class="play">▶ PLAY</span><span>SP No.{card.number}</span></div>
  <div class="label">
    <div class="brand">T-120 · 2026</div>
    <div class="name">{card.name}</div>
    <div class="note">{card.tagline}</div>
    <div class="stripes" aria-hidden="true"></div>
  </div>
  <div class="window" aria-hidden="true"><div class="reel"></div><div class="reel"></div><div class="track"></div></div>
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
    background: #141414;
    color: #e9e9e9;
    display: flex;
    flex-direction: column;
    padding: 5.5cqw;
    gap: 5cqw;
  }
  .osd {
    display: flex;
    justify-content: space-between;
    font-family: "VT323", "VT323 Fallback", monospace;
    font-size: 6.4cqw;
    color: #eafff0;
    text-shadow: 0 0 1.4cqw rgb(120 255 170 / 55%);
    line-height: 1;
  }
  .label {
    position: relative;
    background: #f7f2e4;
    color: #1a1a1a;
    border-radius: 1.6cqw;
    padding: 4.5cqw 22cqw 4.5cqw 5cqw;
    transform: rotate(-1.6deg);
  }
  .brand {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.6cqw;
    letter-spacing: 0.14em;
    color: #6b665c;
  }
  .name {
    font-family: "Permanent Marker", "Permanent Marker Fallback", cursive;
    font-size: 9cqw;
    line-height: 1.02;
    color: #1f2d85;
    margin-top: 1.5cqw;
  }
  .note {
    font-family: "Permanent Marker", "Permanent Marker Fallback", cursive;
    font-size: 4.2cqw;
    color: #3b3b3b;
    margin-top: 2cqw;
  }
  .stripes {
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    width: 17cqw;
    border-start-end-radius: 1.6cqw;
    border-end-end-radius: 1.6cqw;
    background: linear-gradient(90deg, #e03131 0 20%, #f76707 20% 40%, #fcc419 40% 60%, #37b24d 60% 80%, #1c7ed6 80%);
  }
  .window {
    position: relative;
    height: 26cqw;
    background: #0a0a0a;
    border: 0.8cqw solid #2c2c2c;
    border-radius: 3cqw;
    display: flex;
    justify-content: space-around;
    align-items: center;
    overflow: hidden;
  }
  .reel {
    position: relative;
    width: 20cqw;
    aspect-ratio: 1;
    border-radius: 50%;
    background: repeating-conic-gradient(#e9e9e9 0 20deg, #1a1a1a 20deg 60deg);
    border: 3cqw solid #3a2618;
  }
  .reel::after {
    content: "";
    position: absolute;
    inset: 30%;
    border-radius: 50%;
    background: #0a0a0a;
  }
  .track {
    position: absolute;
    inset-inline: 0;
    height: 3cqw;
    background: rgb(255 255 255 / 12%);
    top: 0;
    transform: translateY(-4cqw);
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2cqw;
    margin-top: auto;
    font-family: "VT323", "VT323 Fallback", monospace;
  }
  .stat b {
    font-size: 8cqw;
    line-height: 0.9;
    color: #eafff0;
    text-shadow: 0 0 1.4cqw rgb(120 255 170 / 45%);
  }
  .stat span {
    font-size: 4cqw;
    color: #9aa59d;
    text-transform: uppercase;
  }
  .is-live .reel {
    animation: spin 2.4s linear infinite;
  }
  .is-live .track {
    animation: track 4s linear infinite;
  }
  .is-live .play {
    animation: blink 1.4s steps(2) infinite;
  }
  @keyframes spin {
    to { transform: rotate(1turn); }
  }
  @keyframes track {
    0%, 60% { transform: translateY(-4cqw); }
    100% { transform: translateY(30cqw); }
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
