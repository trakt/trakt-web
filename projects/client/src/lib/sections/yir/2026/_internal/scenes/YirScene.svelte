<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import type { Snippet } from "svelte";

  const {
    id,
    index,
    kicker,
    title,
    lead,
    children,
  }: {
    id: string;
    index: number;
    kicker: string;
    title: string;
    lead?: string;
    children: Snippet<[boolean]>;
  } = $props();

  let isInView = $state(false);
</script>

<section
  {id}
  class="trakt-yir-scene"
  class:is-in={isInView}
  use:whenInViewport={() => (isInView = true)}
>
  <div class="yir-scene-inner">
    <header class="yir-scene-header">
      <span class="yir-scene-kicker" data-reveal>
        {m.yir_2026_scene_kicker({
          number: String(index).padStart(2, "0"),
          title: kicker,
        })}
      </span>
      <h2 class="yir-scene-title" data-reveal style:--d="calc(var(--yir-beat) * 0.4)">{title}</h2>
      {#if lead}
        <p class="yir-scene-lead" data-reveal style:--d="var(--yir-beat)">{lead}</p>
      {/if}
    </header>

    {@render children(isInView)}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-scene {
    width: 100%;
    padding-block: clamp(var(--ni-72), 11vw, var(--ni-160));
    border-top: var(--ni-1) solid var(--color-yir-separator);
    background: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    content-visibility: auto;
    contain-intrinsic-size: auto 100dvh;
  }

  .yir-scene-inner {
    display: flex;
    flex-direction: column;
    gap: clamp(var(--ni-32), 5vw, var(--ni-64));
    container-type: inline-size;
    box-sizing: border-box;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding-inline: var(--ni-24);

    @include for-tablet-lg {
      padding-inline: var(--ni-48);
    }

    @include for-desktop {
      padding-inline: var(--ni-72);
    }
  }

  .yir-scene-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .yir-scene-kicker {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-yir-text-accent);
  }

  .yir-scene-title {
    margin: 0;
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-32), 8cqi, var(--ni-96));
    line-height: 0.95;
    max-width: 16ch;
    overflow-wrap: break-word;
  }

  .yir-scene-lead {
    margin: 0;
    max-width: 48ch;
    font-size: var(--font-size-title);
    color: var(--color-yir-text-secondary);
  }

  .trakt-yir-scene :global([data-reveal]) {
    opacity: 0;
    transform: translateY(var(--ni-32));
    transition:
      opacity var(--yir-t-reveal) ease,
      transform var(--yir-t-reveal) var(--yir-ease);
    transition-delay: var(--d, 0ms);
  }

  .trakt-yir-scene.is-in :global([data-reveal]) {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-yir-scene :global([data-reveal]) {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  .trakt-yir-scene {
    position: relative;
    border-top: 0;
    overflow: clip;
  }

  .trakt-yir-scene::before {
    content: "";
    position: absolute;
    top: 0;
    inset-inline: 0;
    height: var(--ni-1);
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-yir-accent) 20%,
      var(--color-yir-separator) 60%,
      transparent
    );
    transform: scaleX(0);
    transition: transform calc(var(--yir-beat) * 16) var(--yir-ease);
  }

  .trakt-yir-scene::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      50% 40% at 12% 0%,
      color-mix(in srgb, var(--color-yir-accent) 10%, transparent),
      transparent 70%
    );
    opacity: 0;
    transition: opacity calc(var(--yir-beat) * 20) ease;
  }

  .trakt-yir-scene.is-in::before {
    transform: scaleX(1);
  }

  .trakt-yir-scene.is-in::after {
    opacity: 1;
  }

  .yir-scene-inner {
    position: relative;
    z-index: var(--layer-base);
  }

  .trakt-yir-scene :global([data-reveal]) {
    transition:
      opacity var(--yir-t-reveal) ease,
      transform var(--yir-t-reveal) var(--yir-ease),
      clip-path calc(var(--yir-beat) * 5.5) cubic-bezier(0.25, 1, 0.5, 1);
    transition-delay: var(--d, 0ms);
  }

  .yir-scene-title {
    clip-path: inset(-20% -5% -20% -5%);
    transition-duration: calc(var(--yir-beat) * 4.5), calc(var(--yir-beat) * 5.5), calc(var(--yir-beat) * 5.5);
  }

  .trakt-yir-scene:not(.is-in) .yir-scene-title {
    clip-path: inset(100% -5% -20% -5%);
    transform: translateY(var(--ni-16));
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-yir-scene::before,
    .trakt-yir-scene::after,
    .trakt-yir-scene :global([data-reveal]) {
      transition: none;
    }

    .trakt-yir-scene::before {
      transform: none;
    }

    .trakt-yir-scene::after {
      opacity: 1;
    }

    .trakt-yir-scene:not(.is-in) .yir-scene-title {
      clip-path: none;
    }
  }

  .trakt-yir-scene :global(.trakt-link) {
    text-decoration: none;
  }

  .trakt-yir-scene :global([data-hover-line]) {
    background: linear-gradient(
        var(--color-yir-accent),
        var(--color-yir-accent)
      )
      0 100% / 0 max(var(--ni-2), 0.08em) no-repeat;
    transition:
      background-size calc(var(--yir-beat) * 4.5) var(--yir-ease),
      color var(--yir-t-quick) ease;

    :global([dir="rtl"]) & {
      background-position: 100% 100%;
    }
  }

  @include for-mouse {
    .trakt-yir-scene :global(.trakt-link:hover [data-hover-line]),
    .trakt-yir-scene :global(.trakt-link:hover[data-hover-line]),
    .trakt-yir-scene :global(.trakt-link:focus-visible [data-hover-line]) {
      background-size: 100% max(var(--ni-2), 0.08em);
      color: var(--color-yir-text-accent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-yir-scene :global([data-hover-line]) {
      transition: none;
    }
  }
</style>
