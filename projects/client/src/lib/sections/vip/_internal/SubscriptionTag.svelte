<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { Snippet } from "svelte";

  const {
    variant,
    children,
  }: { variant: "popular" | "highlight"; children: Snippet } = $props();
</script>

<trakt-subscription-tag data-variant={variant}>
  <TextTag>
    <p class="uppercase bold">{@render children()}</p>
  </TextTag>
</trakt-subscription-tag>

<style>
  trakt-subscription-tag {
    z-index: var(--layer-raised);

    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;

    :global(.trakt-text-tag) {
      border-radius: var(--border-radius-xxl);
      padding: var(--ni-4) var(--ni-12);
    }

    &[data-variant="highlight"] :global(.trakt-text-tag) {
      background-color: var(--color-vip-popular-tag);
      color: var(--shade-900);
    }

    &[data-variant="popular"] :global(.trakt-text-tag) {
      background-color: var(--purple-500);
      color: var(--shade-10);
    }
  }
</style>
