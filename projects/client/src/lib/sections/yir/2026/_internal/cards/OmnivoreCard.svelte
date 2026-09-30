<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const TOP = ["#e8e8e8", "#f5d90a", "#1fd1e0", "#27c93f", "#d63af9", "#ff3b3b", "#3b5bff"];
  const BOTTOM = ["#3b5bff", "#0d0d0d", "#d63af9", "#0d0d0d", "#1fd1e0", "#0d0d0d", "#e8e8e8"];
  const KEYS = ["#f5d90a", "#1fd1e0", "#d63af9"];
  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="bars" aria-hidden="true">
    <div class="top">
      {#each TOP as color, index (index)}
        <i style="background: {color}; --i: {index}"></i>
      {/each}
    </div>
    <div class="bottom">
      {#each BOTTOM as color, index (index)}
        <i style="background: {color}"></i>
      {/each}
    </div>
    <div class="static"></div>
    <div class="channel">CH {card.stats.at(0)?.value}</div>
  </div>
  <div class="body">
    <div class="no">No. {card.number} · 2026</div>
    <div class="name">{card.name}</div>
    <div class="tag">{card.tagline}</div>
    <div class="stats">
      {#each card.stats as stat, index (stat.key)}
        <div class="stat" style="--k: {KEYS.at(index % KEYS.length)}"><b>{stat.value}</b><span>{stat.label}</span></div>
      {/each}
    </div>
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
    background: #0d0d0d;
    color: #fff;
    display: flex;
    flex-direction: column;
  }
  .bars {
    position: relative;
    height: 50cqw;
    display: grid;
    grid-template-rows: 1fr 10cqw;
  }
  .top,
  .bottom {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  .bottom i {
    filter: brightness(0.45);
  }
  .top i {
    transform-origin: bottom;
  }
  .channel {
    position: absolute;
    top: 4cqw;
    inset-inline-end: 4cqw;
    background: rgb(0 0 0 / 78%);
    font-family: "VT323", "VT323 Fallback", monospace;
    font-size: 7cqw;
    line-height: 1;
    padding: 1cqw 2.4cqw;
    border-radius: 1cqw;
    color: #7dffa0;
  }
  .static {
    position: absolute;
    inset: 0;
    opacity: 0;
    background: repeating-radial-gradient(circle at 30% 40%, #fff 0 0.3cqw, #000 0.3cqw 0.9cqw);
    mix-blend-mode: screen;
  }
  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 5cqw;
  }
  .no {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.8cqw;
    letter-spacing: 0.18em;
    color: #a3a3a3;
  }
  .name {
    font-family: "Bricolage Grotesque", "Bricolage Grotesque Fallback", sans-serif;
    font-weight: 800;
    font-size: 12cqw;
    line-height: 0.92;
    letter-spacing: -0.045em;
    margin-top: 1.5cqw;
  }
  .tag {
    font-size: 3.8cqw;
    color: #cfcfcf;
    margin-top: 2.5cqw;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.4cqw;
    margin-top: auto;
  }
  .stat {
    border-top: 1cqw solid var(--k);
    padding-top: 2cqw;
  }
  .stat b {
    font-family: "Bricolage Grotesque", "Bricolage Grotesque Fallback", sans-serif;
    font-weight: 800;
    font-size: 7cqw;
  }
  .stat span {
    font-size: 2.9cqw;
    color: #b5b5b5;
  }
  .is-live .top i {
    animation: bar-up var(--yir-t-reveal) cubic-bezier(0.2, 0.8, 0.2, 1) both;
    animation-delay: calc(var(--i) * var(--yir-beat) * 0.6);
  }
  .is-live .static {
    animation: static calc(var(--yir-beat) * 11) steps(6) 1 calc(var(--yir-beat) * 6);
  }
  @media (hover: hover) {
    .root:hover .static {
      animation: static calc(var(--yir-beat) * 6) steps(5) 1;
    }
  }
  @keyframes bar-up {
    from { transform: scaleY(0); }
  }
  @keyframes static {
    0%, 100% { opacity: 0; }
    20%, 70% { opacity: 0.9; transform: translate(0, 0); }
    40% { transform: translate(1.3cqw, 0.6cqw); }
    55% { transform: translate(-0.8cqw, 1.1cqw); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
