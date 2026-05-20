<script lang="ts">
  import { Select } from "bits-ui";
  import DropdownCaretIcon from "./DropdownCaretIcon.svelte";
  import type { TraktDropdownListProps } from "./TraktDropdownListProps.ts";

  const {
    label,
    disabled = false,
    icon,
    children,
    items,
  }: TraktDropdownListProps = $props();

  /* TODO
    - extract as Select
    - reduce duplication with MultiSelect
    - keep dropdownitem as is for now for popup menus
    - add support for dark mode
  */
</script>

<Select.Root type="single">
  <Select.Trigger class="trakt-select-trigger" aria-label={label} {disabled}>
    <span class="ellipsis capitalize">
      {#if icon != null}
        {@render icon()}
      {/if}
      {@render children()}
    </span>
    <DropdownCaretIcon open={false} />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="trakt-select-content" sideOffset={8}>
      <Select.ScrollUpButton class="trakt-select-scroll-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path
            d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"
          />
        </svg>
      </Select.ScrollUpButton>

      <Select.Viewport>
        {@render items()}
      </Select.Viewport>

      <Select.ScrollDownButton class="trakt-select-scroll-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path
            d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"
          />
        </svg>
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<style lang="scss">
  :global(.trakt-select-trigger[data-state="open"]) {
    :global(.trakt-dropdown-caret) {
      transform: rotate(180deg);
    }
  }
</style>
