<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="clap" aria-hidden="true"><div class="arm"></div><div class="base"></div></div>
  <div class="board">
    <div class="row" aria-hidden="true">
      <div class="field"><span>Prod.</span><b>Trakt 2026</b></div>
      <div class="field"><span>Scene</span><b>1</b></div>
      <div class="field"><span>Take</span><b>1</b></div>
    </div>
    <div class="main">
      <div class="no">No. {card.number}</div>
      <div class="name">{card.name}</div>
      <div class="tag">{card.tagline}</div>
    </div>
    <div class="row bottom">
      {#each card.stats as stat (stat.key)}
        <div class="field"><span>{stat.label}</span><b>{stat.value}</b></div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #262826;
    color: #f1efe6;
    display: flex;
    flex-direction: column;
  }
  .clap {
    position: relative;
    height: 22cqw;
    flex: none;
  }
  .arm,
  .base {
    position: absolute;
    inset-inline: 4cqw;
    height: 8cqw;
    background: repeating-linear-gradient(-55deg, #f1efe6 0 6cqw, #111 6cqw 12cqw);
    border-radius: 1cqw;
  }
  .arm {
    top: 4cqw;
    transform-origin: 0 100%;
  }
  .base {
    top: 13cqw;
  }
  .board {
    flex: 1;
    margin: 0 4cqw 4cqw;
    border: 0.5cqw solid rgb(241 239 230 / 70%);
    border-radius: 1cqw;
    display: flex;
    flex-direction: column;
  }
  .row {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    border-bottom: 0.4cqw solid rgb(241 239 230 / 50%);
  }
  .row.bottom {
    border-bottom: 0;
    border-top: 0.4cqw solid rgb(241 239 230 / 50%);
  }
  .field + .field {
    border-inline-start: 0.4cqw solid rgb(241 239 230 / 50%);
  }
  .field {
    padding: 2cqw 2.5cqw;
    display: flex;
    flex-direction: column;
  }
  .field span {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.3cqw;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a9a79d;
  }
  .field b {
    font-family: "Caveat", "Caveat Fallback", cursive;
    font-weight: 700;
    font-size: 6.6cqw;
    line-height: 1;
    margin-top: 0.6cqw;
  }
  .main {
    flex: 1;
    padding: 4cqw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .no {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.6cqw;
    letter-spacing: 0.18em;
    color: #a9a79d;
  }
  .name {
    font-family: "Caveat", "Caveat Fallback", cursive;
    font-weight: 700;
    font-size: 14cqw;
    line-height: 0.9;
    margin-top: 1.5cqw;
    color: #ffd166;
  }
  .tag {
    font-size: 3.8cqw;
    color: #d8d6cc;
    margin-top: 2.5cqw;
  }
  .is-live .arm {
    animation: clap calc(var(--yir-beat) * 11) cubic-bezier(0.5, 0, 0.3, 1.4) calc(var(--yir-beat) * 3) both;
  }
  @keyframes clap {
    from { transform: rotate(-24deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
