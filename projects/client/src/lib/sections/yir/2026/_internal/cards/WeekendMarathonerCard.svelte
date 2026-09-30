<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const COUNTDOWN = [5, 4, 3, 2, 1];
  const BANDS = ["#f59f00", "#e8590c", "#c2255c", "#862e4f", "#4a0f1f"];
  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="arch" aria-hidden="true">
    <div class="sun"></div>
    <div class="bands">
      {#each BANDS as color, index (color)}
        <i style="background: {color}; animation-delay: calc(var(--yir-beat) * {5 + index * 0.9})"></i>
      {/each}
    </div>
  </div>
  <div class="no">No. {card.number} · 2026</div>
  <div class="name">{card.name}</div>
  <div class="row">
    <div class="tag">{card.tagline}</div>
    <span class="next" aria-hidden="true"><span class="ring"><span class="drain"><i class="half first"></i><i class="half second"></i></span><span class="count"><span class="digits">{#each COUNTDOWN as digit (digit)}<span>{digit}</span>{/each}</span></span></span>Next episode</span>
  </div>
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
    background: #fff1dc;
    color: #4a0f1f;
    display: flex;
    flex-direction: column;
    padding: 6cqw;
  }
  .arch {
    position: relative;
    height: 50cqw;
    border-radius: 45cqw 45cqw 3cqw 3cqw;
    overflow: hidden;
    background: linear-gradient(#ffe2b0, #ffcf8a);
  }
  .sun {
    position: absolute;
    width: 46cqw;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #ffb03a;
    inset-inline-start: 50%;
    margin-inline-start: -23cqw;
    bottom: 6cqw;
  }
  .bands {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 1.6cqw;
  }
  .bands i {
    display: block;
    height: 3.4cqw;
  }
  .no {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.8cqw;
    letter-spacing: 0.18em;
    margin-top: 5cqw;
    color: #9c3d2b;
  }
  .name {
    font-family: "Shrikhand", "Shrikhand Fallback", serif;
    font-size: 11cqw;
    line-height: 1;
    color: #c2255c;
    text-shadow: 0.7cqw 0.7cqw 0 #4a0f1f;
    margin-top: 1.5cqw;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3cqw;
    margin-top: 3cqw;
  }
  .tag {
    font-size: 3.8cqw;
    font-weight: 600;
  }
  .next {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 1.8cqw;
    background: #4a0f1f;
    color: #fff1dc;
    border-radius: 99px;
    padding: 1.2cqw 3cqw 1.2cqw 1.2cqw;
    font-size: 3cqw;
    font-weight: 600;
  }
  .ring {
    position: relative;
    width: 6cqw;
    height: 6cqw;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #ffb03a;
  }
  .drain {
    position: absolute;
    inset: 0;
    transform: scaleX(-1);
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
    background: linear-gradient(to right, color-mix(in srgb, #4a0f1f 80%, #fff) 50%, transparent 50%);
  }
  .half.second::before {
    left: 0;
    background: linear-gradient(to left, color-mix(in srgb, #4a0f1f 80%, #fff) 50%, transparent 50%);
  }
  .count {
    position: relative;
    width: 4.4cqw;
    height: 4.4cqw;
    border-radius: 50%;
    background: #4a0f1f;
    overflow: hidden;
    font-size: 2.6cqw;
    line-height: 4.4cqw;
    text-align: center;
  }
  .digits {
    display: block;
  }
  .digits span {
    display: block;
    font: inherit;
    color: inherit;
    height: 4.4cqw;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2cqw;
    margin-top: auto;
    border-top: 0.5cqw solid #4a0f1f;
    padding-top: 3cqw;
  }
  .stat b {
    font-family: "Shrikhand", "Shrikhand Fallback", serif;
    font-size: 6.4cqw;
  }
  .stat span {
    font-size: 2.9cqw;
    color: #7a3a3a;
  }
  .is-live .sun {
    animation: sunrise calc(var(--yir-beat) * 16) cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  .is-live .bands i {
    animation: band calc(var(--yir-beat) * 6) cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  .is-live .half.first::before {
    animation: drain-first 5s linear infinite;
  }
  .is-live .half.second::before {
    animation: drain-second 5s linear infinite;
  }
  .is-live .digits {
    animation: countdown 5s steps(5) infinite;
  }
  @keyframes sunrise {
    from { transform: translateY(40cqw); }
  }
  @keyframes band {
    from { transform: scaleX(0); }
  }
  @keyframes countdown {
    to { transform: translateY(-22cqw); }
  }
  @keyframes drain-first {
    50%, 100% { transform: rotate(180deg); }
  }
  @keyframes drain-second {
    0%, 50% { transform: none; }
    100% { transform: rotate(180deg); }
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
