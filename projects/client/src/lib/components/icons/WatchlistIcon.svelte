<script lang="ts">
  type WatchedIconProps = {
    state: "missing" | "added";
  } & IconProps;

  const { state, size }: IconProps & WatchedIconProps = $props();

  const strokeWidth = $derived(size === "small" ? 2.5 : 2);
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  data-size={size}
>
  <path
    d="M6.34315 7.75735C9.46734 4.63315 14.5327 4.63315 17.6569 7.75735L21.8995 12L17.6569 16.2426C14.5327 19.3668 9.46734 19.3668 6.34315 16.2426L2.10051 12L6.34315 7.75735Z"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  {#if state === "missing"}
    <path
      class="when-inactive"
      d="M8 12L16 12 M12 8V16"
      stroke="currentColor"
      stroke-width={strokeWidth}
    />
  {/if}

  <path
    class:when-inactive={state === "added"}
    class:when-active={state === "missing"}
    d="M8 10L12 14L21 5"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />

  {#if state === "added"}
    <path
      class:when-active={state === "added"}
      d="M9.17157 9.17157L14.8284 14.8284 M14.8284 9.17157L9.17158 14.8284"
      stroke="currentColor"
      stroke-width={strokeWidth}
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

  svg[data-size="small"] {
    transform: scale(0.75);
  }
</style>
