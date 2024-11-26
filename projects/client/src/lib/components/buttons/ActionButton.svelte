<script lang="ts">
  import { disableTransitionOn } from "../../utils/actions/disableTransitionOnTouch";

  type ActionButtonProps = ButtonProps & {
    variant?: "purple" | "red" | "blue" | "default";
  };

  const {
    children,
    label,
    variant = "default",
    ...props
  }: ActionButtonProps = $props();
</script>

<button
  use:disableTransitionOn={"touch"}
  aria-label={label}
  data-variant={variant}
  {...props}
>
  {@render children()}
</button>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;

    display: flex;
    width: var(--ni-36);
    height: var(--ni-36);
    padding: var(--ni-6);
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border-radius: var(--ni-12);

    transition: background-color var(--transition-increment) ease-in-out;

    &:active {
      transform: scale(0.95);
    }

    &[data-variant="purple"] {
      background-color: var(--purple-700);
      color: var(--shade-50);

      &:hover {
        background-color: var(--purple-500);
      }
    }

    &[data-variant="red"] {
      background-color: var(--red-700);
      color: var(--shade-50);

      &:hover {
        background-color: var(--red-600);
      }
    }

    &[data-variant="blue"] {
      background-color: var(--blue-700);
      color: var(--shade-50);

      &:hover {
        background-color: var(--blue-500);
      }
    }

    &[data-variant="default"] {
      background-color: var(--shade-800);
      color: var(--shade-50);

      &:hover {
        background-color: var(--shade-500);
      }
    }
  }
</style>
