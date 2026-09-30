<script lang="ts">
  import "./fallback-fonts.css";
  import type { YirPersonaId } from "$lib/requests/models/YirPersonaId";
  import type { Snippet } from "svelte";
  import { personaFonts } from "./personaFonts";
  import { personaPalette } from "./personaPalette";
  import { yirBeats } from "./yirBeats";

  const {
    persona,
    runnerUp,
    children,
  }: {
    persona: YirPersonaId;
    runnerUp?: YirPersonaId | Nil;
    children: Snippet;
  } = $props();

  const palette = $derived(personaPalette(persona));

  const fontsUrl = $derived(
    personaFonts(runnerUp ? [persona, runnerUp] : [persona]),
  );
</script>

<svelte:head>
  <link href={fontsUrl} rel="stylesheet" />
</svelte:head>

<div
  class="trakt-yir-persona-theme"
  data-persona={persona}
  style:--yir-persona-background={palette.background}
  style:--yir-persona-ink={palette.ink}
  style:--yir-persona-accent={palette.accent}
  style:--yir-font-display={palette.display}
  style:--yir-font-body={palette.body}
  style:--yir-beat-base="{yirBeats(1)}ms"
>
  {@render children()}
</div>

<style lang="scss">
  .trakt-yir-persona-theme {
    --yir-font-mono: "JetBrains Mono", "JetBrains Mono Fallback", monospace;
    --yir-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    --yir-beat: var(--yir-beat-base);
    --yir-t-quick: calc(var(--yir-beat) * 2.5);
    --yir-t-reveal: calc(var(--yir-beat) * 7);
    --yir-t-hero: calc(var(--yir-beat) * 10);

    --color-yir-background: var(--yir-persona-background);
    --color-yir-surface: color-mix(in srgb, var(--yir-persona-ink) 6%, var(--yir-persona-background));
    --color-yir-surface-raised: color-mix(in srgb, var(--yir-persona-ink) 10%, var(--yir-persona-background));
    --color-yir-surface-chip: color-mix(in srgb, var(--yir-persona-ink) 16%, var(--yir-persona-background));
    --color-yir-text-primary: var(--yir-persona-ink);
    --color-yir-text-secondary: color-mix(in srgb, var(--yir-persona-ink) 78%, var(--yir-persona-background));
    --color-yir-text-muted: color-mix(in srgb, var(--yir-persona-ink) 58%, var(--yir-persona-background));
    --color-yir-text-accent: var(--yir-persona-accent);
    --color-yir-accent: var(--yir-persona-accent);
    --color-yir-border: var(--yir-persona-ink);
    --color-yir-border-subtle: color-mix(in srgb, var(--yir-persona-ink) 30%, var(--yir-persona-background));
    --color-yir-separator: color-mix(in srgb, var(--yir-persona-ink) 16%, var(--yir-persona-background));
    --color-yir-arrow: color-mix(in srgb, var(--yir-persona-ink) 40%, var(--yir-persona-background));
    --color-yir-badge-background: var(--yir-persona-accent);
    --color-yir-badge-foreground: var(--yir-persona-background);
    --color-yir-title-chip-background: color-mix(in srgb, var(--yir-persona-background) 70%, transparent);
    --color-yir-tooltip-background: color-mix(in srgb, var(--yir-persona-background) 94%, var(--yir-persona-ink));
    --color-yir-upgrade-glow: color-mix(in srgb, var(--yir-persona-accent) 60%, transparent);
    --yir-poster-ground: color-mix(in srgb, var(--yir-persona-accent) 18%, var(--shade-1000));
    --color-yir-poster-foreground: var(--shade-10);
    --color-yir-poster-background: var(--yir-poster-ground);
    --color-yir-poster-surface: color-mix(in srgb, var(--shade-10) 6%, var(--yir-poster-ground));
    --color-yir-poster-surface-raised: color-mix(in srgb, var(--shade-10) 12%, var(--yir-poster-ground));
    --color-yir-poster-chip: color-mix(in srgb, var(--shade-10) 18%, var(--yir-poster-ground));
    --color-yir-scrim: color-mix(in srgb, var(--yir-poster-ground) 80%, transparent);
    --color-yir-scrim-soft: color-mix(in srgb, var(--yir-poster-ground) 50%, transparent);
    --color-yir-hero-gradient-start: color-mix(in srgb, var(--yir-persona-accent) 35%, var(--yir-persona-background));
    --color-yir-hero-gradient-end: var(--yir-persona-background);
    --color-yir-panel-background: radial-gradient(
      120% 90% at 50% 0%,
      color-mix(in srgb, var(--yir-persona-accent) 18%, var(--yir-persona-background)),
      var(--yir-persona-background) 70%
    );

    background-color: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    font-family: var(--yir-font-body);

    @media (prefers-reduced-motion: reduce) {
      --yir-beat: 0ms;
    }
  }
</style>
