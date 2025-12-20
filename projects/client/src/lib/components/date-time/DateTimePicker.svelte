<script lang="ts">
  import { getLanguageAndRegion } from "$lib/features/i18n";
  import CalendarIcon from "../icons/CalendarIcon.svelte";
  import { toDateTimeLocal } from "./_internal/toDateTimeLocal";

  const {
    value,
    maxDate,
    onChange,
  }: { value?: Date; maxDate?: Date; onChange: (date?: Date) => void } =
    $props();

  const { language } = getLanguageAndRegion();

  let inputElement: HTMLInputElement;
  function pickerOnClick(node: HTMLElement) {
    const handler = () => {
      inputElement.showPicker();
    };

    node.addEventListener("click", handler);

    return {
      destroy() {
        node.removeEventListener("click", handler);
      },
    };
  }

  // FIXME: better picker on non-mobile
</script>

<div class="trakt-date-time-picker">
  <div use:pickerOnClick class="trakt-date-time-icon">
    <CalendarIcon />
  </div>
  <input
    bind:this={inputElement}
    class="trakt-date-time-input"
    type="datetime-local"
    value={toDateTimeLocal(value)}
    max={toDateTimeLocal(maxDate)}
    lang={language}
    onchange={(ev) => {
      const target = ev.target as HTMLInputElement;
      if (!target.value) {
        onChange();
        return;
      }

      const selectedDate = new Date(target.value);
      onChange(selectedDate);
    }}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-date-time-picker {
    --data-time-width: clamp(var(--ni-80), 100%, var(--ni-480));
    --data-time-height: var(--ni-48);
    --date-time-icon-size: var(--ni-24);
    --date-time-icon-offset: calc(var(--date-time-icon-size) / 2);
    --date-time-border-radius: var(--border-radius-l);

    display: flex;
    align-items: center;

    height: var(--data-time-height);
    width: var(--data-time-width);

    position: relative;

    transition: outline var(--transition-increment) ease-in-out;

    &:focus-within {
      outline: var(--border-thickness-xs) solid var(--purple-500);
      border-radius: var(--date-time-border-radius);
    }
  }

  .trakt-date-time-input {
    all: unset;
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;

    box-sizing: border-box;

    padding: var(--ni-8) var(--ni-16);
    padding-left: calc(
      var(--date-time-icon-size) + var(--date-time-icon-offset) + var(--ni-16)
    );

    font-size: var(--font-size-text);

    color: var(--color-text-primary);
    background-color: var(--color-input-background);

    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--date-time-border-radius);
  }

  .trakt-date-time-input::-webkit-calendar-picker-indicator {
    display: none;
  }

  .trakt-date-time-icon {
    cursor: pointer;

    position: absolute;
    z-index: calc(var(--layer-top) + var(--layer-overlay));
    top: var(--date-time-icon-offset);
    left: var(--date-time-icon-offset);
  }
</style>
