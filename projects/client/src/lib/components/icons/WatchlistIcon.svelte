<script lang="ts">
  type WatchedIconProps = {
    state: "missing" | "added";
  };

  const { state }: IconProps & WatchedIconProps = $props();
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  data-state={state}
>
  <path
    d="M6.34315 7.75735C9.46734 4.63315 14.5327 4.63315 17.6569 7.75735L21.8995 12L17.6569 16.2426C14.5327 19.3668 9.46734 19.3668 6.34315 16.2426L2.10051 12L6.34315 7.75735Z"
    stroke="currentColor"
    stroke-width="2"
  />
  {#if state === "missing"}
    <path
      class="when-inactive"
      d="M8 12L16 12 M12 8V16"
      stroke="currentColor"
      stroke-width="2"
    />

    <path
      class="when-active"
      d="M8 10L12 14L21 5"
      stroke="currentColor"
      stroke-width="2"
    />
  {/if}

  {#if state === "added"}
    <path
      class="when-inactive"
      d="M8 10L12 14L21 5"
      stroke="currentColor"
      stroke-width="2"
    />

    <path
      class="when-active"
      d="M9.17157 9.17157L14.8284 14.8284 M14.8284 9.17157L9.17158 14.8284"
      stroke="currentColor"
      stroke-width="2"
    />
  {/if}
</svg>

<style>
  path {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  .when-inactive {
    opacity: 1;
  }

  .when-active {
    opacity: 0;
  }

  :global(button):active {
    .when-inactive {
      opacity: 0;
    }

    .when-active {
      opacity: 1;
    }
  }
</style>
