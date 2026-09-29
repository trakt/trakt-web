<script lang="ts">
  import type { Snippet } from "svelte";

  type Row = {
    key: string;
    name: string;
    value: number;
    detail: string;
  };

  const {
    rows,
    active,
    leading,
  }: {
    rows: ReadonlyArray<Row>;
    active: boolean;
    leading?: Snippet<[Row]>;
  } = $props();

  const max = $derived(Math.max(1, ...rows.map((row) => row.value)));
</script>

<ol class="trakt-yir-rank-bars" class:is-active={active}>
  {#each rows as row, index (row.key)}
    <li style:--v={row.value / max} style:--d="calc(var(--yir-beat) * {index} * 0.7)" data-reveal>
      <span class="yir-rank">{String(index + 1).padStart(2, "0")}</span>
      {#if leading}
        {@render leading(row)}
      {/if}
      <span class="yir-rank-name">{row.name}</span>
      <span class="yir-rank-detail">{row.detail}</span>
      <span class="yir-rank-bar" aria-hidden="true"><i></i></span>
    </li>
  {/each}
</ol>

<style lang="scss">
  .trakt-yir-rank-bars {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: auto auto minmax(0, 1fr) auto;
      align-items: center;
      column-gap: var(--ni-12);
      row-gap: var(--ni-6);
    }
  }

  .yir-rank {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);
  }

  .yir-rank-name {
    grid-column: 3;
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-18), 2.4vw, var(--ni-28));
    line-height: 1.1;
    overflow-wrap: break-word;
  }

  li:first-child .yir-rank-name {
    color: var(--color-yir-text-accent);
  }

  .yir-rank-detail {
    grid-column: 4;
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-secondary);
    white-space: nowrap;
  }

  @container (max-width: 26rem) {
    .yir-rank-name {
      grid-column: 3 / -1;
    }

    .yir-rank-detail {
      grid-column: 3 / -1;
      grid-row: 2;
    }
  }

  .yir-rank-bar {
    grid-column: 1 / -1;
    height: var(--ni-6);
    border-radius: var(--ni-6);
    background: var(--color-yir-separator);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--color-yir-accent);
      opacity: calc(0.45 + var(--v) * 0.55);
      transform-origin: left center;
      transform: scaleX(0);
      transition: transform calc(var(--yir-beat) * 11) var(--yir-ease);
      transition-delay: var(--d);

      :global([dir="rtl"]) & {
        transform-origin: right center;
      }
    }
  }

  .is-active .yir-rank-bar i {
    transform: scaleX(var(--v));
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-rank-bar i {
      transform: scaleX(var(--v));
      transition: none;
    }
  }

  .yir-rank-bar i {
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      width: 40%;
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--shade-10) 45%, transparent),
        transparent
      );
      transform: translateX(-120%);
    }
  }

  .is-active .yir-rank-bar i::after {
    animation: rank-sheen calc(var(--yir-beat) * 14) ease-in-out both;
    animation-delay: calc(var(--d) + var(--yir-beat) * 11);
  }

  .yir-rank-name {
    transition:
      translate calc(var(--yir-beat) * 3) var(--yir-ease),
      color calc(var(--yir-beat) * 3) ease;
  }

  @keyframes rank-sheen {
    to {
      transform: translateX(260%);
    }
  }

  @media (hover: hover) {
    li:hover .yir-rank-name {
      translate: var(--ni-6) 0;
      color: var(--color-yir-text-accent);
    }

    li:hover .yir-rank-bar i {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .is-active .yir-rank-bar i::after {
      animation: none;
    }

    .yir-rank-name {
      transition: none;
    }
  }
</style>
