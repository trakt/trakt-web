<script lang="ts">
  import { writable } from "svelte/store";
  import { resolveEnvironmentUri } from "./resolveEnvironmentUri";

  type CrossOriginImageProps = {
    src: string;
    alt: string;
    onLoad?: () => void;
  };

  const { alt, src, onLoad }: CrossOriginImageProps = $props();

  const response = writable({ uri: src });

  const isImageLoaded = writable(false);
</script>

<img
  class:image-loaded={$isImageLoaded}
  src={$response.uri}
  {alt}
  onerror={() => resolveEnvironmentUri(src).then(response.set)}
  onload={() => {
    requestAnimationFrame(() => isImageLoaded.set(true));
    onLoad?.();
  }}
/>

<style>
  .image-loaded {
    opacity: 1;
  }

  img {
    transition: opacity calc(var(--transition-increment) * 2) ease-in;
    opacity: 0;
  }
</style>
