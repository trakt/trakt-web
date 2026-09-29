<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const { card, live }: PersonaCardProps = $props();
</script>

<div class="root" class:is-live={live}>
  <div class="valance" aria-hidden="true"></div>
  <div class="ticket">
    <div class="main">
      <div class="admit" aria-hidden="true">ADMIT ONE</div>
      <div class="name">{card.name}</div>
      <div class="meta" aria-hidden="true"><span>ROW K</span><span>SEAT 26</span><span>No. {card.number}</span></div>
      <div class="tag">{card.tagline}</div>
    </div>
    <div class="perf" aria-hidden="true"></div>
    <div class="stub">
      {#each card.stats as stat (stat.key)}
      <div class="stat"><b>{stat.value}</b><span>{stat.label}</span></div>
    {/each}
      <div class="code" aria-hidden="true"></div>
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
    background:
      radial-gradient(80% 60% at 50% 0%, #7a0f1f, transparent 70%),
      repeating-linear-gradient(90deg, #3e0610 0 3cqw, #5a0a17 3cqw 7cqw, #3e0610 7cqw 10cqw);
    display: grid;
    place-items: center;
  }
  .valance {
    position: absolute;
    inset-inline: 0;
    top: 0;
    height: 7cqw;
    background: #2a040b;
    border-bottom: 0.8cqw solid #d9a441;
  }
  .ticket {
    position: relative;
    width: 78cqw;
    background: #fbf1dc;
    color: #3b0a12;
    border-radius: 2.4cqw;
    transform: rotate(-4deg);
    margin-top: 6cqw;
  }
  .main {
    padding: 6cqw 6cqw 5cqw;
    text-align: center;
  }
  .admit {
    font-family: "JetBrains Mono", monospace;
    font-size: 2.8cqw;
    letter-spacing: 0.4em;
    color: #8a1c2b;
  }
  .name {
    font-family: "Abril Fatface", serif;
    font-size: 12cqw;
    line-height: 0.95;
    color: #b3122b;
    margin-top: 2.5cqw;
  }
  .meta {
    display: flex;
    justify-content: center;
    gap: 3cqw;
    font-family: "JetBrains Mono", monospace;
    font-size: 2.8cqw;
    margin-top: 3cqw;
    color: #5a2a2a;
  }
  .tag {
    font-family: "Playfair Display", serif;
    font-style: italic;
    font-size: 4cqw;
    margin-top: 3cqw;
  }
  .perf {
    position: relative;
    border-top: 0.5cqw dashed #b99a7a;
    margin: 0 3cqw;
  }
  .perf::before,
  .perf::after {
    content: "";
    position: absolute;
    top: -3cqw;
    width: 6cqw;
    height: 6cqw;
    border-radius: 50%;
    background: #4a0812;
  }
  .perf::before {
    inset-inline-start: -6cqw;
  }
  .perf::after {
    inset-inline-end: -6cqw;
  }
  .stub {
    padding: 4cqw 6cqw 5cqw;
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 3cqw;
    align-items: end;
    transform-origin: 0 0;
    transition: transform calc(var(--yir-beat) * 4) cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .stat b {
    font-family: "Abril Fatface", serif;
    font-size: 7.4cqw;
    line-height: 1;
  }
  .stat span {
    font-size: 2.8cqw;
    color: #6b3b3b;
  }
  .code {
    width: 14cqw;
    height: 9cqw;
    background: repeating-linear-gradient(90deg, #3b0a12 0 0.5cqw, transparent 0.5cqw 1cqw, #3b0a12 1cqw 1.8cqw, transparent 1.8cqw 2.2cqw);
  }
  @media (hover: hover) {
    .root:hover .stub {
      transform: rotate(4deg) translateY(1cqw);
    }
  }
  .is-live .ticket {
    animation: ticket-in var(--yir-t-hero) cubic-bezier(0.2, 0.9, 0.25, 1.15) both;
  }
  @keyframes ticket-in {
    from { transform: translateY(80cqw) rotate(8deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
