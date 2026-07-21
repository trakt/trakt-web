<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import type { TraktButtonProps } from "$lib/components/buttons/TraktButtonProps.ts";
  import type { Snippet } from "svelte";

  const {
    children,
    href,
    target,
    label,
    icon,
    iconPosition = "trailing",
    text,
    onclick,
  }: ChildrenProps &
    Pick<HTMLAnchorProps, "href" | "target"> &
    Pick<TraktButtonProps, "text"> & {
      label: string;
      icon?: Snippet;
      iconPosition?: "leading" | "trailing";
      onclick?: () => void;
    } = $props();
</script>

<div class="trakt-banner-cta" data-icon-position={iconPosition}>
  <Button
    {href}
    {target}
    {label}
    {icon}
    {text}
    {onclick}
    color="purple"
    variant="primary"
    style="outline"
    size="small"
  >
    {@render children()}
  </Button>
</div>

<style lang="scss">
  .trakt-banner-cta {
    display: contents;

    :global(.trakt-button) {
      min-width: var(--ni-132);
      justify-content: center;
      gap: var(--gap-xs);
    }

    &[data-icon-position="leading"] :global(.button-icon) {
      order: -1;
    }
  }
</style>
