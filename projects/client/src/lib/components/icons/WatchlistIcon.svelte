<script lang="ts">
  type WatchedIconProps = {
    state: "missing" | "added";
  } & IconProps;

  const { state, size }: IconProps & WatchedIconProps = $props();
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
  {#if state === "missing"}
    <path
      stroke="currentColor"
      class="icon-state-idle"
      stroke-width="2"
      d="M18 2v10m-5-5h10m-8-4H3v18h15v-7M6 7h5m-5 4h9m-9 4h9m-9 4h9"
    />
  {/if}

  <path
    stroke="currentColor"
    class:icon-state-idle={state === "added"}
    class:icon-state-active={state === "missing"}
    stroke-width="2"
    d="m9 7 4 4 9-9"
  />
  <path
    stroke="currentColor"
    class:icon-state-idle={state === "added"}
    class:icon-state-active={state === "missing"}
    stroke-width="2"
    d="M15 3H3v18h15v-9M6 11h2m-2 4h9m-9 4h9"
  />

  {#if state === "added"}
    <path
      stroke="currentColor"
      class="icon-state-active"
      stroke-width="2"
      d="m22 2-8 8m0-8 8 8M11 3H3v18h15v-9M6 7h5m-5 4h5m-5 4h9m-9 4h9"
    />
  {/if}
</svg>

<style lang="scss">
  @use "$style/mixins/index" as *;

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

  @include for-touch {
    svg {
      &[data-state="added"] {
        .icon-state-active {
          opacity: 1;
        }

        .icon-state-idle {
          opacity: 0;
        }
      }
    }
  }
</style>
