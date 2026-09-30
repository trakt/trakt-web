<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const DIGITS = [8, 7, 6, 5, 4, 3, 2];

  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="edge" aria-hidden="true"><div class="holes"></div></div>
  <div class="mid">
    <div class="no">No. {card.number} · 2026 · 2.20 : 1</div>
    <div class="screen" aria-hidden="true">
      <div class="leader">
        <div class="sweep"><i class="half first"></i><i class="half second"></i></div>
        <div class="cross"></div>
        <div class="ring outer"></div>
        <div class="ring inner"></div>
        <div class="count"><div class="digits">{#each DIGITS as digit (digit)}<span>{digit}</span>{/each}</div></div>
      </div>
      <div class="beam"></div>
      <div class="grain"></div>
    </div>
    <div class="name">{card.name}</div>
    <div class="tag">{card.tagline}</div>
    <div class="credits">
      {#each card.stats as stat (stat.key)}
      <div class="stat"><b>{stat.value}</b><span>{stat.label}</span></div>
    {/each}
    </div>
  </div>
  <div class="edge" aria-hidden="true"><div class="holes"></div></div>
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
    background: #0a0a0a;
    color: #f2efe8;
    display: flex;
  }
  .edge {
    flex: none;
    width: 9cqw;
    position: relative;
    background: #000;
    overflow: hidden;
  }
  .holes {
    position: absolute;
    inset-inline: 2.5cqw;
    top: 0;
    height: 200%;
    background: repeating-linear-gradient(transparent 0 2.2cqw, #2b2b2b 2.2cqw 5.4cqw, transparent 5.4cqw 7.6cqw);
  }
  .mid {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 7cqw 4cqw 6cqw;
  }
  .no {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.6cqw;
    letter-spacing: 0.2em;
    color: #8f8a80;
  }
  .screen {
    margin-top: 3cqw;
    aspect-ratio: 2.2 / 1;
    background: #151515;
    position: relative;
    overflow: hidden;
    border-radius: 0.6cqw;
  }
  .leader {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: radial-gradient(
      closest-side,
      #3a362f,
      #1d1b18 80%
    );
  }
  .sweep {
    position: absolute;
    width: 30cqw;
    aspect-ratio: 1;
  }
  .half {
    position: absolute;
    inset-block: 0;
    width: 50%;
    overflow: hidden;
  }
  .half.first {
    left: 50%;
  }
  .half.second {
    left: 0;
  }
  .half::before {
    content: "";
    position: absolute;
    top: 0;
    width: 200%;
    height: 100%;
    border-radius: 50%;
  }
  .half.first::before {
    left: -100%;
    background: linear-gradient(to right, rgb(242 239 232 / 34%) 50%, transparent 50%);
  }
  .half.second::before {
    left: 0;
    background: linear-gradient(to left, rgb(242 239 232 / 34%) 50%, transparent 50%);
  }
  .cross {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgb(242 239 232 / 35%), rgb(242 239 232 / 35%)) center / 100% 0.3cqw no-repeat,
      linear-gradient(rgb(242 239 232 / 35%), rgb(242 239 232 / 35%)) center / 0.3cqw 100% no-repeat;
  }
  .ring {
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 0.4cqw solid rgb(242 239 232 / 70%);
  }
  .ring.outer {
    width: 30cqw;
  }
  .ring.inner {
    width: 24cqw;
    border-width: 0.3cqw;
    border-color: rgb(242 239 232 / 45%);
  }
  .count {
    position: relative;
    font-family: "Instrument Serif", "Instrument Serif Fallback", serif;
    font-size: 17cqw;
    line-height: 1;
    color: #f2efe8;
    height: 1em;
    overflow: hidden;
  }
  .digits {
    display: flex;
    flex-direction: column;
  }
  .digits span {
    display: block;
    font: inherit;
    height: 1em;
    text-align: center;
  }
  .beam {
    position: absolute;
    inset: 0;
    background: conic-gradient(from 160deg at 50% 125%, transparent 0deg, rgb(255 244 214 / 22%) 20deg, rgb(255 244 214 / 6%) 30deg, transparent 40deg);
    mix-blend-mode: screen;
  }
  .grain {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, rgb(255 255 255 / 10%) 0 0.3cqw, transparent 0.4cqw),
      radial-gradient(circle at 70% 60%, rgb(255 255 255 / 8%) 0 0.2cqw, transparent 0.3cqw),
      radial-gradient(circle at 45% 80%, rgb(0 0 0 / 30%) 0 0.3cqw, transparent 0.4cqw),
      linear-gradient(90deg, transparent 62%, rgb(242 239 232 / 10%) 62.3%, transparent 62.6%);
    background-size: 100% 100%;
  }
  .name {
    font-family: "Instrument Serif", "Instrument Serif Fallback", serif;
    font-style: italic;
    font-size: 14cqw;
    line-height: 0.9;
    margin-top: 6cqw;
  }
  .tag {
    font-size: 3.6cqw;
    color: #bdb7ab;
    margin-top: 2cqw;
  }
  .credits {
    margin-top: auto;
    display: grid;
    gap: 1.6cqw;
  }
  .stat {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 2cqw;
    border-bottom: 0.3cqw solid #2a2a2a;
    padding-bottom: 1.2cqw;
  }
  .stat b {
    font-family: "Instrument Serif", "Instrument Serif Fallback", serif;
    font-size: 6.4cqw;
    font-weight: 400;
    order: 2;
  }
  .stat span {
    font-family: "IBM Plex Sans", "IBM Plex Sans Fallback", sans-serif;
    font-size: 2.6cqw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #9d978c;
  }
  .is-live .holes {
    animation: sprocket 1.2s linear infinite;
  }
  .is-live .beam {
    animation: flicker 3.2s steps(1) infinite;
  }
  .is-live .screen {
    animation: letterbox var(--yir-t-hero) cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  .is-live .digits {
    animation: leader-count 7s steps(7, jump-none) infinite;
  }
  .is-live .half.first::before {
    animation: sweep-first 1s linear infinite;
  }
  .is-live .half.second::before {
    animation: sweep-second 1s linear infinite;
  }
  .is-live .grain {
    animation: grain 0.4s steps(3) infinite;
  }
  @keyframes sprocket {
    to { transform: translateY(-7.6cqw); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    12% { opacity: 0.82; }
    14% { opacity: 1; }
    61% { opacity: 0.9; }
    63% { opacity: 1; }
  }
  @keyframes leader-count {
    to { transform: translateY(-6em); }
  }
  @keyframes sweep-first {
    50%, 100% { transform: rotate(180deg); }
  }
  @keyframes sweep-second {
    0%, 50% { transform: none; }
    100% { transform: rotate(180deg); }
  }
  @keyframes grain {
    33% { transform: translate(1cqw, -0.5cqw); }
    66% { transform: translate(-0.8cqw, 0.6cqw); }
  }
  @keyframes letterbox {
    from { clip-path: inset(50% 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root *,
    .root *::before,
    .root *::after {
      animation: none !important;
    }
  }
</style>
