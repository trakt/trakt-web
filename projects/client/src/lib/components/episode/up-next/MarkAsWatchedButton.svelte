<script lang="ts">
  type MarkAsWatchedButtonProps = {
    label: string;
  } & HTMLElementProps;

  const { label, ...props }: MarkAsWatchedButtonProps = $props();
</script>

<button class="mark-as-watched-button" aria-label={label} {...props}>
  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none">
    <path
      class="icon-background"
      d="M0 8c0-4.41828 3.58172-8 8-8h19c4.4183 0 8 3.58172 8 8v19c0 4.4183-3.5817 8-8 8H8c-4.41828 0-8-3.5817-8-8V8Z"
    />
    <path class="icon" stroke-width="2" d="M29 10 13.9474 24.96 7 18.2477" />
  </svg>
</button>

<style>
  .mark-as-watched-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;

    &:disabled {
      cursor: not-allowed;

      .icon-background {
        opacity: 0.25;
      }

      .icon {
        opacity: 0.25;
      }
    }

    &:not(:disabled) {
      &:hover {
        .icon-background {
          fill: var(--purple-200);
        }

        .icon {
          stroke: var(--purple-900);
        }
      }

      &:active {
        .icon-background {
          fill: var(--purple-400);
        }

        .icon {
          stroke: var(--purple-50);
        }
      }
    }

    .icon-background {
      fill: var(--shade-800);
      transition: fill 100ms linear;
    }

    .icon {
      stroke: var(--shade-100);
      transition: stroke 100ms linear;
    }
  }
</style>
