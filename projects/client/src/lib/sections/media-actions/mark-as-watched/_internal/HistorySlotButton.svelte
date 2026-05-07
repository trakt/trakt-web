<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";

  type HistorySlot = {
    startDate: Date;
    endDate: Date;
  };

  type HistorySlotButtonProps = {
    timeSlot: HistorySlot;
    isActive: boolean;
    label: string;
    onClick: (slot: HistorySlot) => void;
  };

  const { timeSlot, isActive, label, onClick }: HistorySlotButtonProps =
    $props();
</script>

<button
  class="trakt-history-slot-btn"
  class:is-active={isActive}
  aria-label={label}
  onclick={() => onClick(timeSlot)}
  disabled={isActive}
>
  <div class="trakt-history-slot-btn-line"></div>
  <div class="trakt-history-slot-icon">
    {#if isActive}
      <CheckIcon />
    {:else}
      <PlusIcon />
    {/if}
  </div>
  <div class="trakt-history-slot-btn-line"></div>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-history-slot-btn {
    --color-history-slot: var(--color-text-primary);
    --color-history-line: var(--color-border);
    --color-history-slot-active: var(--purple-500);
    --color-history-slot-active-text: var(--shade-10);
    --height-history-slot-btn: var(--ni-32);

    all: unset;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    width: 100%;
    height: var(--height-history-slot-btn);

    cursor: pointer;

    &[disabled] {
      cursor: default;
      pointer-events: none;
    }

    &.is-active {
      --color-history-line: var(--color-history-slot-active);

      .trakt-history-slot-icon {
        transform: scale(1.2);

        background-color: var(--color-history-slot-active);
        color: var(--color-history-slot-active-text);
      }

      .trakt-history-slot-btn-line {
        height: var(--ni-2);
      }
    }

    @include for-mouse() {
      &:hover,
      &:focus-visible {
        --color-history-line: var(--color-history-slot);

        .trakt-history-slot-icon {
          transform: scale(1.1);
        }
      }
    }
  }

  .trakt-history-slot-btn-line {
    flex: 1;
    height: var(--ni-1);
    background-color: var(--color-history-line);

    transition: var(--transition-increment) ease;
    transition-property: background-color, height;
  }

  .trakt-history-slot-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-24);
    height: var(--ni-24);

    border-radius: var(--border-radius-s);
    border: var(--ni-1) solid var(--color-history-line);
    box-sizing: border-box;

    transition: var(--transition-increment) ease;
    transition-property: background-color, border-color, color, transform;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
