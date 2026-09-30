<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="panel" aria-hidden="true">
    <div class="lines"></div>
    <div class="sun"></div>
    <i class="petal" style="--x: 20%; --d: 0s"></i>
    <i class="petal" style="--x: 55%; --d: calc(var(--yir-beat) * 20)"></i>
    <i class="petal" style="--x: 75%; --d: calc(var(--yir-beat) * 40)"></i>
    <div class="kata">アニメ航海者</div>
  </div>
  <div>
    <div class="no">No. {card.number} · 2026</div>
    <div class="name">{card.name}</div>
    <div class="tag">{card.tagline}</div>
    <div class="stats">
    {#each card.stats as stat (stat.key)}
      <div class="stat"><b>{stat.value}</b><span>{stat.label}</span></div>
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
    background: #15102e;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 5cqw;
    gap: 4.5cqw;
  }
  .panel {
    position: relative;
    flex: 1;
    border: 1.3cqw solid #fff;
    border-radius: 2cqw;
    overflow: hidden;
    background: #ff5fa2;
  }
  .lines {
    position: absolute;
    inset: -60%;
    background: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 5deg, rgb(255 255 255 / 28%) 5deg 6.2deg);
  }
  .sun {
    position: absolute;
    width: 40cqw;
    aspect-ratio: 1;
    inset-inline-start: 14cqw;
    top: 50%;
    translate: 0 -50%;
    border-radius: 50%;
    background: #fff5f9;
    border: 1.3cqw solid #15102e;
  }
  .kata {
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    width: 15cqw;
    background: #15102e;
    writing-mode: vertical-rl;
    font-family: "Dela Gothic One", "Dela Gothic One Fallback", sans-serif;
    font-size: 8cqw;
    display: grid;
    place-items: center;
    letter-spacing: 0.12em;
    color: #ff8cc0;
  }
  .petal {
    position: absolute;
    width: 3.4cqw;
    height: 2.2cqw;
    border-radius: 100% 0;
    background: #fff;
    opacity: 0;
    top: -5cqw;
    inset-inline-start: var(--x);
  }
  .no {
    font-family: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    font-size: 2.8cqw;
    letter-spacing: 0.18em;
    color: #ff8cc0;
  }
  .name {
    font-family: "Dela Gothic One", "Dela Gothic One Fallback", sans-serif;
    font-size: 10.5cqw;
    line-height: 1;
    margin-top: 1.5cqw;
  }
  .tag {
    font-size: 3.9cqw;
    color: #d9d2f3;
    margin-top: 2cqw;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2cqw;
    border-top: 0.4cqw solid rgb(255 255 255 / 18%);
    padding-top: 3.5cqw;
    margin-top: 3.5cqw;
  }
  .stat b {
    font-family: "Dela Gothic One", "Dela Gothic One Fallback", sans-serif;
    font-size: 5.6cqw;
  }
  .stat span {
    font-size: 2.9cqw;
    color: #b9b0da;
  }
  .is-live .lines {
    animation: spin 50s linear infinite;
  }
  .is-live .sun {
    animation: pop calc(var(--yir-beat) * 9) cubic-bezier(0.3, 1.6, 0.5, 1) both;
  }
  .is-live .petal {
    animation: petal 6s linear infinite;
    animation-delay: var(--d);
  }
  @keyframes petal {
    0% { opacity: 0; transform: translate(0, 0) rotate(0); }
    10% { opacity: 0.95; }
    100% { opacity: 0; transform: translate(-22cqw, 90cqw) rotate(540deg); }
  }
  @keyframes pop {
    from { scale: 0.2; opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(1turn); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
