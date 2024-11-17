<script lang="ts">
  import { writable } from "svelte/store";
  import { resolveEnvironmentUri } from "./resolveEnvironmentUri";

  type CrossOriginImageProps = {
    src: string;
    alt: string;
    onLoad?: () => void;
  };

  const { alt, src, onLoad }: CrossOriginImageProps = $props();

  const response = writable({ uri: "" });

  $effect(() => {
    if (!src) {
      return;
    }

    resolveEnvironmentUri(src).then(response.set);
  });

  const isImageLoaded = writable(false);
</script>

{#if $response.uri}
  <img
    class:image-loaded={$isImageLoaded}
    src={$response.uri}
    {alt}
    onload={() => {
      requestAnimationFrame(() => isImageLoaded.set(true));
      onLoad?.();
    }}
  />
{/if}

<style>
  .image-loaded {
    opacity: 1;
  }

  img {
    transition: opacity calc(var(--transition-increment) * 2) ease-in;
    opacity: 0;
  }
</style>
