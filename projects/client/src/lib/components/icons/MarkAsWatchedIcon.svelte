<script lang="ts">
  const {
    size = "normal",
    state,
  }: IconProps & {
    state: "watched" | "unwatched";
  } = $props();

  const strokeWidth = $derived(size === "small" ? 3 : 2);
</script>

<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  data-size={size}
  data-state={state}
>
  {#if state === "unwatched"}
    <path
      class="icon-state-idle"
      d="M22.6661 3.24663L9.16757 19.3336L1.37548 12.7952"
      stroke="currentColor"
      stroke-width={strokeWidth}
    />
  {/if}

  {#if state === "watched"}
    <path
      class="icon-state-active"
      stroke="currentColor"
      stroke-width="2"
      d="M20 4 4.00002 20M4 4l16 16"
    />
  {/if}

  <path
    class:icon-state-active={state === "unwatched"}
    class:icon-state-idle={state === "watched"}
    d="M20.6595 2.50823L15.1953 9.02014L8.44608 17.0636M8.44608 17.0636L1.55168 11.2785M8.44608 17.0636L12.2763 20.2775"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  <path
    class:icon-state-active={state === "unwatched"}
    class:icon-state-idle={state === "watched"}
    d="M8.71946 12.0717L4.12319 8.21497"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
  <path
    class:icon-state-active={state === "unwatched"}
    class:icon-state-idle={state === "watched"}
    d="M23.7231 5.07892L13.4385 17.3356"
    stroke="currentColor"
    stroke-width={strokeWidth}
  />
</svg>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  path {
    transition: opacity var(--transition-increment) ease-in-out;
  }

  .icon-state-idle {
    opacity: 1;
  }

  .icon-state-active {
    opacity: 0;
  }

  @include for-mouse {
    :global(li):focus,
    :global(li):hover,
    :global(button):focus,
    :global(button):hover {
      .icon-state-idle {
        opacity: 0;
      }

      .icon-state-active {
        opacity: 1;
      }
    }
  }

  svg[data-size="small"] {
    transform: scale(0.75);
  }
</style>
