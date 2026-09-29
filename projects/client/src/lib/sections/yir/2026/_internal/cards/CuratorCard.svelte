<script lang="ts">
  import type { PersonaCardProps } from "./PersonaCardProps";
  const FIELDS = [
    { color: "#96f2d7", flex: 3 },
    { color: "#e9c46a", flex: 1.2 },
    { color: "#2f7fd8", flex: 2 },
  ];
  const { card, live }: PersonaCardProps = $props();
  const media = $derived(
    card.stats.map((stat) => `${stat.value} ${stat.label}`).join(", "),
  );
</script>

<div class="root" class:is-live={live}>
  <div class="spot" aria-hidden="true"></div>
  <div class="frame" aria-hidden="true">
    <div class="art">
      {#each FIELDS as field, index (field.color)}
        <i style="--c: {field.color}; --f: {field.flex}; --i: {index}"></i>
      {/each}
    </div>
  </div>
  <div class="placard">
    <div class="name">{card.name}</div>
    <div class="meta">No. {card.number} · 2026</div>
    <div class="tag">{card.tagline}</div>
    <div class="media">{media}</div>
  </div>
</div>

<style lang="scss">
  .root {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: radial-gradient(55% 45% at 50% 0%, #fff, #e8e6e0 70%);
    color: #1d1d1b;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10cqw 8cqw 7cqw;
  }
  .spot {
    position: absolute;
    inset: 0;
    background: conic-gradient(from 165deg at 50% -8%, transparent 0deg, rgb(255 250 235 / 90%) 15deg, transparent 30deg);
    pointer-events: none;
  }
  .frame {
    position: relative;
    width: 56cqw;
    aspect-ratio: 4 / 5;
    background: #fbfaf7;
    border: 2.6cqw solid #1f1d1a;
    padding: 5cqw;
  }
  .art {
    width: 100%;
    height: 100%;
    background: #16457a;
    display: flex;
    flex-direction: column;
    gap: 2cqw;
    padding: 3cqw;
  }
  .art i {
    flex: var(--f);
    border-radius: 1cqw;
    background: var(--c);
  }
  .placard {
    position: relative;
    align-self: stretch;
    margin-top: 7cqw;
    background: #fff;
    padding: 3.5cqw 4cqw;
    font-family: "IBM Plex Sans", sans-serif;
  }
  .name {
    font-weight: 700;
    font-size: 6.4cqw;
    line-height: 1.05;
  }
  .meta {
    font-size: 2.7cqw;
    color: #6b6a64;
    margin-top: 1cqw;
  }
  .tag {
    font-style: italic;
    font-size: 3.6cqw;
    margin-top: 2cqw;
  }
  .media {
    font-size: 2.8cqw;
    color: #4a4944;
    margin-top: 1.2cqw;
  }
  .is-live .spot {
    animation: lights-on calc(var(--yir-beat) * 14) ease-out both;
  }
  .is-live .art i {
    animation: settle var(--yir-t-hero) cubic-bezier(0.2, 0.8, 0.2, 1) both;
    animation-delay: calc(var(--yir-beat) * 5 + var(--i) * var(--yir-beat) * 1.8);
  }
  .is-live .frame {
    animation: hang var(--yir-t-hero) cubic-bezier(0.3, 1.4, 0.5, 1) both;
  }
  @keyframes lights-on {
    0% { opacity: 0; }
    30% { opacity: 0.9; }
    36% { opacity: 0.2; }
    50%, 100% { opacity: 1; }
  }
  @keyframes settle {
    from { opacity: 0; transform: translateY(-4cqw); }
  }
  @keyframes hang {
    from { transform: translateY(-6cqw) rotate(-3deg); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .root,
    .root * {
      animation: none !important;
    }
  }
</style>
