<script lang="ts">
  import { writable } from "svelte/store";
  import { resolveEnvironmentUri } from "./resolveEnvironmentUri";

  const {
    alt,
    src,
    loading = "lazy",
    animate = true,
    onload: _onload,
    onerror: _onerror,
  }: HTMLImageElementProps & { animate?: boolean } = $props();

  const response = $derived(writable({ uri: src }));
  const isImageLoaded = $derived(writable(false));
</script>

<img
  {loading}
  class:image-loaded={$isImageLoaded}
  class:image-animation-enabled={animate}
  src={$response.uri}
  {alt}
  onerror={(ev) => {
    resolveEnvironmentUri(src).then(response.set);
    _onerror?.(ev);
  }}
  onload={function (ev) {
    setTimeout(() => {
      isImageLoaded.set(true);
    }, 100);
    _onload?.(ev);
  }}
/>

<style>
  img.image-animation-enabled {
    transition: opacity calc(var(--transition-increment) * 2) ease-in-out;
    opacity: 0;

    &.image-loaded {
      opacity: 1;
    }
  }

  img {
    text-indent: -8008135px;
  }
</style>
