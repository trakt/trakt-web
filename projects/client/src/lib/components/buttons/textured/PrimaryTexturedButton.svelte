<script lang="ts">
  import type { ButtonProps } from "../ButtonProps";
  import TexturedButton from "./TexturedButton.svelte";

  const { children, ...props }: ButtonProps = $props();
</script>

<TexturedButton
  {...props}
  --color-background-button="var(--color-surface-button-primary)"
  --color-foreground-button="var(--color-foreground-button-primary)"
>
  {@render children()}
</TexturedButton>
