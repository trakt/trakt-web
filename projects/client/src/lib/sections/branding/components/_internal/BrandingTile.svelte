<script lang="ts">
  import { revealOnView } from "$lib/utils/actions/revealOnView.ts";
  import type { BrandingBackdrop } from "../../models/BrandingBackdrop.ts";
  import type { LogoFormat } from "../../models/LogoFormat.ts";
  import type { BrandingLogo } from "./BrandingLogo.ts";
  import DownloadSplitPill from "./DownloadSplitPill.svelte";

  type BrandingTileProps = {
    logo: BrandingLogo;
    backdrop: BrandingBackdrop;
    format: LogoFormat;
    revealDelay?: number;
    onDownload: (params: { element: HTMLElement; format: LogoFormat }) => void;
  };

  const {
    logo,
    backdrop,
    format,
    revealDelay = 0,
    onDownload,
  }: BrandingTileProps = $props();

  const Artwork = $derived(logo.artwork);

  let preview = $state<HTMLElement>();
</script>

<div class="trakt-branding-tile" use:revealOnView={{ delay: revealDelay }}>
  <div
    class="logo-preview"
    bind:this={preview}
    data-logo={logo.key}
    data-backdrop={backdrop}
    data-look={logo.look}
  >
    <div class="logo-artwork" data-shape={logo.shape}>
      <Artwork />
    </div>
  </div>
  <span class="secondary logo-label">{logo.label}</span>
  <DownloadSplitPill
    logo={logo.label}
    {format}
    onDownload={(chosen) => {
      if (preview) onDownload({ element: preview, format: chosen });
    }}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);
  }

  .logo-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: var(--ni-160);
    padding: var(--gap-xl);
    box-sizing: border-box;
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-base);

    transition:
      background-color 200ms ease-in-out,
      box-shadow var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        box-shadow: var(--shadow-floating);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    &[data-backdrop="light"] {
      background-color: var(--branding-white);
      color: var(--branding-ink);
      --color-foreground: var(--branding-ink);
    }

    &[data-backdrop="dark"] {
      background-color: var(--branding-ink);
      color: var(--branding-white);
      --color-foreground: var(--branding-white);
    }

    &[data-backdrop="brand"] {
      background-color: var(--color-brand-violet);
      color: var(--branding-white);
      --color-foreground: var(--branding-white);
    }

    &[data-backdrop="transparent"] {
      --checker: color-mix(in srgb, var(--branding-ink) 10%, transparent);

      background-color: var(--branding-white);
      background-image: conic-gradient(
        var(--checker) 25%,
        transparent 0 50%,
        var(--checker) 0 75%,
        transparent 0
      );
      background-size: var(--ni-16) var(--ni-16);
      color: var(--branding-ink);
      --color-foreground: var(--branding-ink);
    }

    &[data-look="branded"] {
      --purple-600: var(--color-brand-violet);
      --circle-mark-bg: var(--color-brand-violet);
      --circle-mark-fill: var(--branding-white);

      &[data-backdrop="brand"] {
        --purple-600: var(--branding-white);
        --logo-mark-fill: var(--color-brand-violet);
        --circle-mark-bg: var(--branding-white);
        --circle-mark-fill: var(--color-brand-violet);
      }
    }

    &[data-look="mono"] {
      --purple-600: var(--color-foreground);
      --circle-mark-bg: var(--color-foreground);
      --circle-mark-fill: var(--branding-white);

      &[data-backdrop="dark"] {
        --logo-mark-fill: var(--branding-ink);
        --circle-mark-fill: var(--branding-ink);
      }
    }
  }

  .logo-artwork {
    :global(svg) {
      width: 100%;
      height: auto;
    }

    &[data-shape="wide"] {
      width: var(--ni-200);
    }

    &[data-shape="square"] {
      width: var(--ni-80);
    }
  }

  .logo-label {
    font-size: var(--ni-12);
    text-align: center;
  }
</style>
