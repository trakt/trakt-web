<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
  const lead = $derived(card.stats.at(0));
  const ticker = $derived(
    card.stats.slice(1).map((stat) => `${stat.value} ${stat.label}`).join("  •  "),
  );
</script>

<div class="root" class:is-live={live}>
  <div class="screen">
    <div class="top">
      <span class="live-bug" aria-hidden="true"><i></i>LIVE</span>
      <span>No. {card.number} · 2026</span>
    </div>
    <div class="big">{lead?.value}</div>
    <div class="cap">{lead?.label}</div>
  </div>
  <div class="lower">
    <div class="l1">{card.name}</div>
    <div class="l2">{card.tagline}</div>
  </div>
  <div class="ticker"><span class="track">{ticker}  •  {ticker}</span></div>
</div>

<style lang="scss">
  .root {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #0b0b0f;
    color: #fff;
    display: flex;
    flex-direction: column;
  }
  .screen {
    flex: 1;
    position: relative;
    background: radial-gradient(90% 70% at 50% 45%, #4a0d18, #0b0b0f 75%);
    padding: 5cqw;
    display: flex;
    flex-direction: column;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.8cqw;
    letter-spacing: 0.14em;
    color: #c9c3cf;
  }
  .live-bug {
    display: inline-flex;
    align-items: center;
    gap: 1.6cqw;
    background: #ff2d3d;
    color: #fff;
    font-weight: 600;
    padding: 1cqw 2.4cqw;
    border-radius: 1cqw;
  }
  .live-bug i {
    width: 1.8cqw;
    height: 1.8cqw;
    border-radius: 50%;
    background: #fff;
  }
  .big {
    font-family: "Archivo Black", "Archivo Black Fallback", sans-serif;
    font-size: 30cqw;
    line-height: 0.85;
    margin-top: auto;
    letter-spacing: -0.04em;
  }
  .cap {
    font-size: 3.8cqw;
    color: #d7d0dc;
    max-width: 70cqw;
    margin: 2cqw 0 4cqw;
  }
  .lower {
    padding: 0 5cqw 4cqw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .l1 {
    background: #fff;
    color: #0b0b0f;
    font-family: "Archivo Black", "Archivo Black Fallback", sans-serif;
    font-size: 7.2cqw;
    padding: 1.4cqw 3cqw;
    border-inline-start: 2.4cqw solid #ff2d3d;
    text-transform: uppercase;
  }
  .l2 {
    background: #ff2d3d;
    color: #fff;
    font-size: 3.8cqw;
    font-weight: 600;
    padding: 1cqw 3cqw;
  }
  .ticker {
    background: #fff;
    color: #0b0b0f;
    overflow: hidden;
    white-space: pre;
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-weight: 600;
    font-size: 3.4cqw;
    padding: 1.8cqw 0;
    text-transform: uppercase;
  }
  .track {
    display: inline-block;
    padding-inline-start: 100%;
  }
  .is-live .live-bug i {
    animation: blink 1.2s steps(2) infinite;
  }
  .is-live .l1 {
    animation: slide-in calc(var(--yir-beat) * 6) cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--yir-beat) * 2) both;
  }
  .is-live .l2 {
    animation: slide-in calc(var(--yir-beat) * 6) cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--yir-beat) * 3.5) both;
  }
  .is-live .track {
    animation: marquee 14s linear infinite;
  }
  .is-live .big {
    animation: rise calc(var(--yir-beat) * 8) cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  @keyframes slide-in {
    from { transform: translateX(-110%); }
  }
  @keyframes marquee {
    to { transform: translateX(-100%); }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(8cqw); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
