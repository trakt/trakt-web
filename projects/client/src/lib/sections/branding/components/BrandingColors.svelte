<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { revealOnView } from "$lib/utils/actions/revealOnView.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { error } from "$lib/utils/console/print.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import type { BrandColor } from "./_internal/BrandColor.ts";
  import { brandColors } from "./_internal/brandColors.ts";

  const COPIED_DURATION_MS = time.seconds(2);

  const colorNames: Record<BrandColor["key"], () => string> = {
    violet: m.text_branding_color_violet,
    white: m.text_branding_color_white,
    ink: m.text_branding_color_ink,
  };

  let copiedKey = $state<BrandColor["key"]>();
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const copy = async ({ key, hex }: BrandColor) => {
    try {
      await copyToClipboard(hex);
    } catch (cause) {
      error("Could not copy the color", cause);
      return;
    }

    copiedKey = key;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copiedKey = undefined), COPIED_DURATION_MS);
  };

  onDestroy(() => clearTimeout(resetTimer));
</script>

<section class="trakt-branding-colors" use:revealOnView>
  <div class="branding-colors-header">
    <h2 class="branding-section-heading">{m.heading_branding_colors()}</h2>
    <p class="secondary branding-colors-desc">
      {m.text_branding_colors_desc()}
    </p>
  </div>

  <ul class="branding-color-list">
    {#each brandColors as color (color.key)}
      {@const name = colorNames[color.key]()}
      <li>
        <button
          class="branding-color-row"
          type="button"
          aria-label={m.button_label_branding_copy_color({
            color: name,
            hex: color.hex,
          })}
          onclick={() => copy(color)}
        >
          <span class="branding-color-dot" style:background={color.hex}></span>
          <span class="branding-color-name">
            <span class="bold">{name}</span>
            <span class="secondary small branding-color-hex">{color.hex}</span>
          </span>
          <span
            class="branding-copy-pill bold small"
            data-copied={copiedKey === color.key}
            aria-hidden="true"
          >
            <span class="copy-state" data-state="idle">
              {m.button_label_copy()}
            </span>
            <span class="copy-state" data-state="done">
              {m.button_label_copied()}
            </span>
          </span>
        </button>
      </li>
    {/each}
  </ul>

  <p class="branding-copy-status" role="status">
    {copiedKey ? m.button_label_copied() : ""}
  </p>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding-colors {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    width: 100%;
  }

  .branding-colors-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .branding-colors-desc {
    max-width: var(--ni-640);
    line-height: 1.6;
  }

  .branding-color-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: var(--ni-640);
  }

  .branding-color-row {
    all: unset;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: var(--gap-m);
    width: 100%;
    height: var(--ni-64);
    padding-inline: var(--ni-10) var(--gap-m);

    border-radius: var(--border-radius-pill);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: box-shadow var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        box-shadow: var(--shadow-floating);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
    }
  }

  .branding-color-dot {
    flex-shrink: 0;
    width: var(--ni-44);
    height: var(--ni-44);
    border-radius: 50%;
    box-shadow: 0 0 0 var(--ni-3)
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .branding-color-name {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .branding-color-hex {
    font-family: ui-monospace, monospace;
  }

  .branding-copy-pill {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;

    --copy-shift: var(--ni-8);

    width: var(--ni-80);
    height: var(--ni-28);

    @media (prefers-reduced-motion: reduce) {
      --copy-shift: 0px;
    }

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .copy-state {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      opacity var(--transition-increment) ease-in-out,
      transform var(--transition-increment) ease-in-out;

    &[data-state="done"] {
      color: var(--color-accent-purple);
      opacity: 0;
      transform: translateY(var(--copy-shift));
    }

    .branding-copy-pill[data-copied="true"] &[data-state="idle"] {
      opacity: 0;
      transform: translateY(calc(-1 * var(--copy-shift)));
    }

    .branding-copy-pill[data-copied="true"] &[data-state="done"] {
      opacity: 1;
      transform: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .branding-copy-status {
    @include visually-hidden;
  }
</style>
