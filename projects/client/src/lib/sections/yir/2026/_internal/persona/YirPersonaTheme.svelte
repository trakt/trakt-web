<script lang="ts">
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
  @font-face {
    font-family: "JetBrains Mono Fallback";
    src: local("Courier New"), local("CourierNewPSMT");
    font-weight: 100 500;
    size-adjust: 99.98%;
    ascent-override: 102.02%;
    descent-override: 30%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "JetBrains Mono Fallback";
    src: local("Courier New Bold"), local("CourierNewPS-BoldMT");
    font-weight: 600 900;
    size-adjust: 99.98%;
    ascent-override: 102.02%;
    descent-override: 30.01%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Spline Sans Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 99.17%;
    ascent-override: 96.81%;
    descent-override: 24.2%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Spline Sans Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0030;
    size-adjust: 106.8%;
    ascent-override: 89.89%;
    descent-override: 22.47%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Spline Sans Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0031-0039;
    size-adjust: 104.74%;
    ascent-override: 91.66%;
    descent-override: 22.91%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Spline Sans Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 96.14%;
    ascent-override: 99.85%;
    descent-override: 24.96%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Spline Sans Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0030;
    size-adjust: 110.76%;
    ascent-override: 86.68%;
    descent-override: 21.67%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Spline Sans Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0031-0039;
    size-adjust: 104.53%;
    ascent-override: 91.84%;
    descent-override: 22.96%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Dela Gothic One Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 130.35%;
    ascent-override: 88.99%;
    descent-override: 22.25%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Dela Gothic One Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0030-0039;
    size-adjust: 164.39%;
    ascent-override: 70.56%;
    descent-override: 17.64%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Archivo Black Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 122.36%;
    ascent-override: 71.92%;
    descent-override: 17.16%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Archivo Black Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0030;
    size-adjust: 119.92%;
    ascent-override: 73.38%;
    descent-override: 17.51%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Archivo Black Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0031-0039;
    size-adjust: 121.49%;
    ascent-override: 72.44%;
    descent-override: 17.29%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Shrikhand Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 128.33%;
    ascent-override: 80.26%;
    descent-override: 33.51%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Shrikhand Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0030;
    size-adjust: 142.22%;
    ascent-override: 72.42%;
    descent-override: 30.24%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Shrikhand Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0031-0039;
    size-adjust: 130.96%;
    ascent-override: 78.65%;
    descent-override: 32.83%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "VT323 Fallback";
    src: local("Courier New"), local("CourierNewPSMT");
    size-adjust: 66.61%;
    ascent-override: 120.11%;
    descent-override: 30.03%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Permanent Marker Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 111.34%;
    ascent-override: 99.7%;
    descent-override: 28.74%;
    line-gap-override: 2.69%;
  }

  @font-face {
    font-family: "Permanent Marker Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0030;
    size-adjust: 123.43%;
    ascent-override: 89.93%;
    descent-override: 25.93%;
    line-gap-override: 2.43%;
  }

  @font-face {
    font-family: "Permanent Marker Fallback";
    src: local("Arial"), local("ArialMT");
    unicode-range: U+0031-0039;
    size-adjust: 94.42%;
    ascent-override: 117.56%;
    descent-override: 33.89%;
    line-gap-override: 3.18%;
  }

  @font-face {
    font-family: "Bricolage Grotesque Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 103.42%;
    ascent-override: 91.32%;
    descent-override: 26.86%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Bricolage Grotesque Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0030;
    size-adjust: 116.69%;
    ascent-override: 80.93%;
    descent-override: 23.8%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Bricolage Grotesque Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0031-0039;
    size-adjust: 108.77%;
    ascent-override: 86.83%;
    descent-override: 25.54%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Bricolage Grotesque Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 96.67%;
    ascent-override: 96.98%;
    descent-override: 28.02%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Bricolage Grotesque Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0030;
    size-adjust: 114.34%;
    ascent-override: 82%;
    descent-override: 23.69%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Bricolage Grotesque Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0031-0039;
    size-adjust: 109.4%;
    ascent-override: 85.7%;
    descent-override: 24.76%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Abril Fatface Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 110.87%;
    ascent-override: 95.61%;
    descent-override: 26.16%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Abril Fatface Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0030;
    size-adjust: 132.81%;
    ascent-override: 79.81%;
    descent-override: 21.84%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Abril Fatface Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0031-0039;
    size-adjust: 108.19%;
    ascent-override: 97.97%;
    descent-override: 26.8%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 100 800;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 105.22%;
    ascent-override: 102.65%;
    descent-override: 23.76%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 100 800;
    unicode-range: U+0030;
    size-adjust: 129%;
    ascent-override: 83.72%;
    descent-override: 19.38%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 100 800;
    unicode-range: U+0031-0039;
    size-adjust: 98.28%;
    ascent-override: 109.89%;
    descent-override: 25.44%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 900;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 107.14%;
    ascent-override: 100.8%;
    descent-override: 23.33%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 900;
    unicode-range: U+0030;
    size-adjust: 135%;
    ascent-override: 80%;
    descent-override: 18.52%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 900;
    unicode-range: U+0031-0039;
    size-adjust: 103.07%;
    ascent-override: 104.78%;
    descent-override: 24.26%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Italic"), local("TimesNewRomanPS-ItalicMT");
    font-style: italic;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 104.96%;
    ascent-override: 102.89%;
    descent-override: 23.82%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Italic"), local("TimesNewRomanPS-ItalicMT");
    font-style: italic;
    unicode-range: U+0030;
    size-adjust: 113%;
    ascent-override: 95.58%;
    descent-override: 22.12%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Playfair Display Fallback";
    src: local("Times New Roman Italic"), local("TimesNewRomanPS-ItalicMT");
    font-style: italic;
    unicode-range: U+0031-0039;
    size-adjust: 93.47%;
    ascent-override: 115.54%;
    descent-override: 26.75%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Instrument Serif Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 81.53%;
    ascent-override: 121.43%;
    descent-override: 38.02%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Instrument Serif Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0030;
    size-adjust: 92%;
    ascent-override: 107.61%;
    descent-override: 33.7%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Instrument Serif Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    unicode-range: U+0031-0039;
    size-adjust: 72.64%;
    ascent-override: 136.28%;
    descent-override: 42.67%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Instrument Serif Fallback";
    src: local("Times New Roman Italic"), local("TimesNewRomanPS-ItalicMT");
    font-style: italic;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 85.92%;
    ascent-override: 115.22%;
    descent-override: 36.08%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Instrument Serif Fallback";
    src: local("Times New Roman Italic"), local("TimesNewRomanPS-ItalicMT");
    font-style: italic;
    unicode-range: U+0030;
    size-adjust: 92.22%;
    ascent-override: 107.35%;
    descent-override: 33.62%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Instrument Serif Fallback";
    src: local("Times New Roman Italic"), local("TimesNewRomanPS-ItalicMT");
    font-style: italic;
    unicode-range: U+0031-0039;
    size-adjust: 73.56%;
    ascent-override: 134.59%;
    descent-override: 42.14%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 99.62%;
    ascent-override: 102.39%;
    descent-override: 27.1%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial"), local("ArialMT");
    font-weight: 100 500;
    unicode-range: U+0030-0039;
    size-adjust: 108.3%;
    ascent-override: 94.19%;
    descent-override: 24.93%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 97.61%;
    ascent-override: 104.5%;
    descent-override: 27.66%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0030;
    size-adjust: 107.87%;
    ascent-override: 94.56%;
    descent-override: 25.03%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0031-0039;
    size-adjust: 108.92%;
    ascent-override: 93.65%;
    descent-override: 24.79%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial Italic"), local("Arial-ItalicMT");
    font-style: italic;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 97.54%;
    ascent-override: 104.57%;
    descent-override: 27.68%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "IBM Plex Sans Fallback";
    src: local("Arial Italic"), local("Arial-ItalicMT");
    font-style: italic;
    unicode-range: U+0030-0039;
    size-adjust: 108.3%;
    ascent-override: 94.19%;
    descent-override: 24.93%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    font-weight: 100 500;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 96.94%;
    ascent-override: 94.91%;
    descent-override: 29.92%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    font-weight: 100 500;
    unicode-range: U+0030;
    size-adjust: 95.41%;
    ascent-override: 96.43%;
    descent-override: 30.4%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman"), local("TimesNewRomanPSMT");
    font-weight: 100 500;
    unicode-range: U+0031-0039;
    size-adjust: 98.9%;
    ascent-override: 93.02%;
    descent-override: 29.32%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 91.53%;
    ascent-override: 100.51%;
    descent-override: 31.68%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0030;
    size-adjust: 95.41%;
    ascent-override: 96.43%;
    descent-override: 30.4%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman Bold"), local("TimesNewRomanPS-BoldMT");
    font-weight: 600 900;
    unicode-range: U+0031-0039;
    size-adjust: 99.25%;
    ascent-override: 92.7%;
    descent-override: 29.22%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman Bold Italic"), local("TimesNewRomanPS-BoldItalicMT");
    font-style: italic;
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 86.3%;
    ascent-override: 106.61%;
    descent-override: 33.61%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman Bold Italic"), local("TimesNewRomanPS-BoldItalicMT");
    font-style: italic;
    unicode-range: U+0030;
    size-adjust: 89%;
    ascent-override: 103.37%;
    descent-override: 32.58%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Cormorant Garamond Fallback";
    src: local("Times New Roman Bold Italic"), local("TimesNewRomanPS-BoldItalicMT");
    font-style: italic;
    unicode-range: U+0031-0039;
    size-adjust: 99.25%;
    ascent-override: 92.7%;
    descent-override: 29.22%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Caveat Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    unicode-range: U+0000-002F, U+003A-10FFFF;
    size-adjust: 72.59%;
    ascent-override: 132.25%;
    descent-override: 41.33%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: "Caveat Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    unicode-range: U+0030-0039;
    size-adjust: 81.32%;
    ascent-override: 118.05%;
    descent-override: 36.89%;
    line-gap-override: 0%;
  }

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
