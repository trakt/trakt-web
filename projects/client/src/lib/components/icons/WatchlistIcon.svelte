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
      class="icon-state-idle"
      stroke="currentColor"
      stroke-width="2"
      d="M18 11v12M12 17h12M1 7h18M1 12h13M1 17h8M1 2h18"
    />
  {/if}

  <path
    class:icon-state-idle={state === "added"}
    class:icon-state-active={state === "missing"}
    stroke="currentColor"
    stroke-width="2"
    d="m10 17 4 4 9-9M1 7h18M1 12h14M1 17h6M1 2h18"
  />

  {#if state === "added"}
    <path
      class="icon-state-active"
      stroke="currentColor"
      stroke-width="2"
      d="M22 12 12 22M12 12l10 10M1 7h18M1 12h8m-8 5h8M1 2h18"
    />
  {/if}
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
