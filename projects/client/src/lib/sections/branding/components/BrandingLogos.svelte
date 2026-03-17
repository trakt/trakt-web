<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import LogoMarkCircle from "$lib/components/logo/LogoMarkCircle.svelte";
  import LogoText from "$lib/components/logo/LogoText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { downloadFile } from "$lib/sections/settings/export/downloadFile.ts";
  import { toSvgBlob } from "$lib/sections/settings/export/toSvgBlob.ts";

  function handleDownload(event: MouseEvent, filename: string) {
    const target = event.currentTarget as HTMLElement;
    const previewElement = target.closest<HTMLElement>('.logo-preview');
    if (!previewElement) return;

    const blob = toSvgBlob(previewElement);
    if (blob) downloadFile(blob, `${filename}.svg`);
  }
</script>

{#snippet downloadBtn(filename: string)}
  <button
    class="logo-download"
    aria-label="Download"
    onclick={(e) => handleDownload(e, filename)}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1V11M8 11L4 7M8 11L12 7M1 14H15"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="square"
      />
    </svg>
  </button>
{/snippet}

<div class="branding-logo-sections">
  <section class="branding-logo-section">
    <div class="branding-section-header">
      <h2 class="branding-section-heading">
        {m.heading_branding_default_logos()}
      </h2>
      <p class="branding-section-desc secondary">
        {m.text_branding_default_logos_desc()}
      </p>
    </div>
    <div class="logo-grid">
      <div class="logo-item">
        <div class="logo-preview logo-preview--light">
          <div class="logo-full">
            <Logo />
          </div>
          {@render downloadBtn("trakt-logo")}
        </div>
        <span class="secondary logo-label">Full Logo</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--light logo-preview--branded">
          <div class="logo-mark">
            <LogoMark />
          </div>
          {@render downloadBtn("trakt-logomark")}
        </div>
        <span class="secondary logo-label">Logo Mark</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--light logo-preview--branded">
          <div class="logo-mark">
            <LogoMarkCircle />
          </div>
          {@render downloadBtn("trakt-circlemark")}
        </div>
        <span class="secondary logo-label">Circle Mark</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--light">
          <div class="logo-full">
            <LogoText />
          </div>
          {@render downloadBtn("trakt-text-logo")}
        </div>
        <span class="secondary logo-label">Text Logo</span>
      </div>
    </div>
  </section>

  <section class="branding-logo-section">
    <div class="branding-section-header">
      <h2 class="branding-section-heading">
        {m.heading_branding_dark_background()}
      </h2>
      <p class="branding-section-desc secondary">
        {m.text_branding_dark_background_desc()}
      </p>
    </div>
    <div class="logo-grid">
      <div class="logo-item">
        <div class="logo-preview logo-preview--dark">
          <div class="logo-full">
            <Logo />
          </div>
          {@render downloadBtn("trakt-logo-dark")}
        </div>
        <span class="secondary logo-label">Full Logo</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--dark logo-preview--branded">
          <div class="logo-mark">
            <LogoMark />
          </div>
          {@render downloadBtn("trakt-logomark-dark")}
        </div>
        <span class="secondary logo-label">Logo Mark</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--dark logo-preview--branded">
          <div class="logo-mark">
            <LogoMarkCircle />
          </div>
          {@render downloadBtn("trakt-circlemark-dark")}
        </div>
        <span class="secondary logo-label">Circle Mark</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--dark">
          <div class="logo-full">
            <LogoText />
          </div>
          {@render downloadBtn("trakt-text-logo-dark")}
        </div>
        <span class="secondary logo-label">Text Logo</span>
      </div>
    </div>
  </section>

  <section class="branding-logo-section">
    <div class="branding-section-header">
      <h2 class="branding-section-heading">
        {m.heading_branding_alternative_logos()}
      </h2>
      <p class="branding-section-desc secondary">
        {m.text_branding_alt_logos_desc()}
      </p>
    </div>
    <div class="logo-grid">
      <div class="logo-item">
        <div class="logo-preview logo-preview--light">
          <div class="logo-mark">
            <LogoMarkCircle />
          </div>
          {@render downloadBtn("trakt-circlemark-mono-light")}
        </div>
        <span class="secondary logo-label">Circle Mark — Light</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--dark">
          <div class="logo-mark">
            <LogoMarkCircle />
          </div>
          {@render downloadBtn("trakt-circlemark-mono-dark")}
        </div>
        <span class="secondary logo-label">Circle Mark — Dark</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--light logo-preview--mono">
          <div class="logo-mark">
            <LogoMark />
          </div>
          {@render downloadBtn("trakt-logomark-mono-light")}
        </div>
        <span class="secondary logo-label">Logo Mark — Light</span>
      </div>
      <div class="logo-item">
        <div class="logo-preview logo-preview--dark logo-preview--mono">
          <div class="logo-mark">
            <LogoMark />
          </div>
          {@render downloadBtn("trakt-logomark-mono-dark")}
        </div>
        <span class="secondary logo-label">Logo Mark — Dark</span>
      </div>
    </div>
  </section>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .branding-logo-sections {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);
    width: 100%;
  }

  .branding-logo-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .branding-section-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .branding-section-desc {
    line-height: 1.6;
    max-width: var(--ni-640);
  }

  .logo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--ni-160), 1fr));
    gap: var(--gap-m);
  }

  .logo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);
  }

  .logo-preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: var(--ni-160);
    padding: var(--gap-xl);
    box-sizing: border-box;
    border-radius: var(--border-radius-xl);

    transition: border-color var(--transition-increment) ease-in-out;

    &--light {
      background: #ffffff;
      color: #111111;
      --color-foreground: #111111;
      border: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-border) 40%, transparent);

      @include for-mouse {
        &:hover {
          border-color: color-mix(in srgb, var(--purple-500) 40%, transparent);
        }
      }
    }

    &--dark {
      background: #111111;
      color: #ffffff;
      --color-foreground: #ffffff;
      border: var(--border-thickness-xxs) solid transparent;

      // On dark+mono the square is white, so the inner mark must be dark
      &.logo-preview--mono {
        --logo-mark-fill: #111111;
      }

      @include for-mouse {
        &:hover {
          border-color: color-mix(in srgb, var(--purple-500) 40%, transparent);
        }
      }
    }

    // Force canonical brand purple regardless of seasonal theme overrides
    &--branded {
      --purple-500: #9f42c6;
      --color-foreground: #9f42c6;
      --circle-mark-bg: #ffffff;
    }

    // Monochrome: square inherits the foreground color instead of brand purple
    &--mono {
      --purple-500: var(--color-foreground);
    }
  }

  .logo-full {
    width: var(--ni-200);

    :global(svg) {
      width: 100%;
      height: auto;
    }
  }

  .logo-mark {
    width: var(--ni-80);

    :global(svg) {
      width: 100%;
      height: auto;
    }
  }

  .logo-label {
    font-size: var(--ni-12);
    text-align: center;
  }

  .logo-download {
    position: absolute;
    top: var(--gap-s);
    right: var(--gap-s);

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-28);
    height: var(--ni-28);
    padding: 0;

    background: transparent;
    border: none;
    border-radius: var(--border-radius-m);
    color: currentColor;
    opacity: 0;
    cursor: pointer;

    transition: opacity var(--transition-increment) ease;

    @include for-mouse {
      .logo-preview:hover & {
        opacity: 0.6;
      }

      &:hover {
        opacity: 1;
      }
    }

    // Always visible on touch
    @include for-touch {
      opacity: 0.6;
    }
  }
</style>
