<script lang="ts">
  import TuneIcon from "$lib/components/icons/TuneIcon.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { FilterSettingsProps } from "./FilterSettingsProps.ts";

  const { label, isModified, content }: FilterSettingsProps = $props();

  const buttonLabel = $derived(
    isModified
      ? m.button_label_filter_settings_modified({ filter: label })
      : m.button_label_filter_settings({ filter: label }),
  );
</script>

{#snippet panel()}
  <div class="trakt-filter-settings-panel">
    <span class="bold">{label}</span>
    {@render content()}
  </div>
{/snippet}

<Popover label={buttonLabel} content={panel}>
  <span class="trakt-filter-settings-button" class:is-modified={isModified}>
    <TuneIcon />
  </span>
</Popover>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @include icon-button-box(".trakt-filter-settings-button");
  @include icon-button-ghost(".trakt-filter-settings-button", scale(0.92));

  .trakt-filter-settings-button {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-32);
    height: var(--ni-32);

    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    &.is-modified {
      color: var(--color-text-primary);
    }

    &.is-modified::after {
      content: "";
      position: absolute;
      inset-block-start: var(--ni-4);
      inset-inline-end: var(--ni-4);

      width: var(--ni-6);
      height: var(--ni-6);
      border-radius: 50%;
      background-color: var(--color-link-active);
    }
  }

  .trakt-filter-settings-panel {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-width: var(--ni-240);
  }
</style>
