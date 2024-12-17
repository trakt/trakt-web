<script lang="ts">
  const { open, disabled }: { open: boolean; disabled?: boolean | Nil } =
    $props();
</script>

<svg
  class="trakt-dropdown-caret {open ? 'open' : ''}"
  aria-disabled={disabled}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  width="17"
  height="16"
  viewBox="0 0 17 16"
>
  <path stroke="currentColor" stroke-width="2" d="m1.5 4.5 7 7 7-7" />
</svg>

<style>
  .trakt-dropdown-caret {
    transition: transform var(--transition-increment) ease-in-out;
    /** 
    * Visually align the caret with the text, due to the shape it's optically off-center.
    */
    margin-top: 1px;
  }

  .trakt-dropdown-caret.open {
    transform: rotate(180deg);
  }
</style>
