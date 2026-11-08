<script lang="ts">
  import DropdownCaretIcon from "$lib/components/dropdown/DropdownCaretIcon.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { LogoFormat } from "../../models/LogoFormat.ts";

  type DownloadSplitPillProps = {
    logo: string;
    format: LogoFormat;
    onDownload: (format: LogoFormat) => void;
  };

  const { logo, format, onDownload }: DownloadSplitPillProps = $props();

  const formats = [
    { value: "svg", text: "SVG" },
    { value: "png", text: "PNG" },
    { value: "jpg", text: "JPG" },
    { value: "webp", text: "WebP" },
  ] as const satisfies ReadonlyArray<{ value: LogoFormat; text: string }>;

  let isOpen = $state(false);

  const formatText = (value: LogoFormat) =>
    formats.find((option) => option.value === value)?.text ?? value;

  const pick = (value: LogoFormat) => () => {
    isOpen = false;
    onDownload(value);
  };
</script>

{#snippet menu()}
  <DropdownGroup style="menu">
    {#each formats as option (option.value)}
      <DropdownItem
        selected={option.value === format}
        onclick={pick(option.value)}
        label={m.button_label_branding_download_logo({
          logo,
          format: option.text,
        })}
      >
        {option.text}
      </DropdownItem>
    {/each}
  </DropdownGroup>
{/snippet}

<div class="trakt-download-split-pill">
  <button
    class="download-main"
    type="button"
    aria-label={m.button_label_branding_download_logo({
      logo,
      format: formatText(format),
    })}
    onclick={() => onDownload(format)}
  >
    <span class="bold small">{formatText(format)}</span>
  </button>

  <span class="download-divider" aria-hidden="true"></span>

  <div class="download-more">
    <Popover
      label={m.button_label_branding_download_options({ logo })}
      open={isOpen}
      onOpenChange={(value) => (isOpen = value)}
      content={menu}
    >
      <span class="download-caret">
        <DropdownCaretIcon open={isOpen} />
      </span>
    </Popover>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-download-split-pill {
    display: inline-flex;
    align-items: center;
    height: var(--ni-40);
    box-sizing: border-box;

    border-radius: var(--border-radius-pill);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    backdrop-filter: blur(var(--ni-8));
    box-shadow: var(--shadow-base);
    color: var(--color-text-primary);
  }

  .download-more {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .download-main {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 100%;
    padding-inline: var(--ni-16) var(--ni-12);
    border-start-start-radius: var(--border-radius-pill);
    border-end-start-radius: var(--border-radius-pill);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid currentColor;
      outline-offset: calc(-1 * var(--ni-2));
    }
  }

  .download-divider {
    align-self: stretch;
    margin-block: var(--ni-8);
    width: var(--border-thickness-xxs);
    background: color-mix(in srgb, var(--color-foreground) 16%, transparent);
  }

  .download-more :global(.trakt-popover-trigger) {
    height: 100%;
    padding-inline: var(--ni-12) var(--ni-14);
    box-sizing: border-box;
    align-items: center;
    border-start-end-radius: var(--border-radius-pill);
    border-end-end-radius: var(--border-radius-pill);
    color: var(--color-accent-purple);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }
    }
  }

  .download-caret {
    display: flex;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>
