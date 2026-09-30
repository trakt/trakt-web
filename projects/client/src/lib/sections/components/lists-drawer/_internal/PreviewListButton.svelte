<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";

  const { label, onclick }: { label: string; onclick: () => void } = $props();
</script>

<li class="trakt-preview-list-button">
  <button type="button" class="preview-button" {onclick} aria-label={label}>
    <span class="preview-caret" aria-hidden="true">
      <CaretRightIcon />
    </span>
  </button>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-preview-list-button {
    --preview-caret-size: var(--ni-14);

    list-style-type: none;

    :global(.trakt-dropdown-group) > &:not(:last-child) {
      border-block-end: var(--ni-1) solid var(--color-option-list-separator);
    }
  }

  .preview-button {
    appearance: none;
    margin: 0;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--ni-14) * 2 + var(--ni-20));
    padding: 0;

    background: transparent;
    -webkit-tap-highlight-color: transparent;

    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: var(--color-select-item-hover);
      }
    }

    &:active {
      background: var(--color-select-item-hover);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: calc(-1 * var(--border-thickness-xs));
    }
  }

  .preview-caret {
    display: inline-flex;
    align-items: center;
    opacity: 0.55;

    transition:
      transform var(--transition-increment) ease-out,
      opacity var(--transition-increment) ease-out;

    :global(svg) {
      width: var(--preview-caret-size);
      height: var(--preview-caret-size);
    }
  }

  .preview-button:hover .preview-caret {
    opacity: 0.9;
    transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
  }
</style>
