<script lang="ts">
  type AddButtonProps = {
    label: string;
  } & HTMLElementProps;

  const { label, ...props }: AddButtonProps = $props();
</script>

<button class="add-button" aria-label={label} {...props}>
  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none">
    <path
      class="icon-background"
      d="M0 8c0-4.41828 3.58172-8 8-8h19c4.4183 0 8 3.58172 8 8v19c0 4.4183-3.5817 8-8 8H8c-4.41828 0-8-3.5817-8-8V8Z"
    />
    <path class="icon" stroke-width="2" d="M17 8v18m-9-9h18" />
  </svg>
</button>

<style>
  .add-button {
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
          fill: var(--blue-50);
        }

        .icon {
          stroke: var(--blue-400);
        }
      }

      &:active {
        .icon-background {
          fill: var(--blue-400);
        }

        .icon {
          stroke: var(--blue-50);
        }
      }
    }

    .icon-background {
      fill: var(--shade-800);
      transition: fill var(--transition-increment) linear;
    }

    .icon {
      stroke: var(--shade-100);
      transition: stroke var(--transition-increment) linear;
    }
  }
</style>
