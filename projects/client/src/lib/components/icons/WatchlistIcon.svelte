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
>
  {#if state === "missing"}
    <path d="M12 2L12 22" stroke="currentColor" stroke-width="2" />
    <path d="M2 12L22 12" stroke="currentColor" stroke-width="2" />
  {/if}

  {#if state === "added"}
    <path d="M3 12L21 12" stroke="currentColor" stroke-width="2" />
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
