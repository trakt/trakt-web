<script lang="ts">
  const { size = "normal" }: IconProps = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M6.34315 7.75732C9.46734 4.63312 14.5327 4.63312 17.6569 7.75732L21.8995 12L17.6569 16.2426C14.5327 19.3668 9.46734 19.3668 6.34315 16.2426L2.10051 12L6.34315 7.75732Z"
    stroke="currentColor"
    stroke-width="2"
  />
  <path
    class="icon"
    d="M8 12L16 12 M12 8V16"
    stroke="currentColor"
    stroke-width="2"
  />

  <path
    class="icon-active"
    d="M8 10L12 14L21 5"
    stroke="currentColor"
    stroke-width="2"
  />
</svg>

<style>
  .icon {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
  }

  .icon-active {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  :global(button):active {
    .icon {
      opacity: 0;
    }

    .icon-active {
      opacity: 1;
    }
  }
</style>
