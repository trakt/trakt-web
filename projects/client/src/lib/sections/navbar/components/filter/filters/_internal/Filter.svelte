<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const {
    title,
    children,
    variant = "default",
  }: {
    title: string;
    variant?: "default" | "inline";
  } & ChildrenProps = $props();
</script>

<div
  class="trakt-filter"
  data-dpad-navigation={DpadNavigationType.List}
  data-variant={variant}
>
  <span>{title}</span>
  {@render children()}
</div>

<style>
  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-width: 0;

    span {
      font-size: var(--font-size-text);
      letter-spacing: 0.04em;
      text-transform: capitalize;

      opacity: 0.8;
    }

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      gap: var(--gap-m);
    }
  }
</style>
