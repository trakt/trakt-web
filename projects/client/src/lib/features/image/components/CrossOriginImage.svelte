<script lang="ts">
  import { disableTransitionOnComplete } from "$lib/utils/actions/disableTransitionOnComplete";
  import { writable } from "svelte/store";
  import { resolveEnvironmentUri } from "./resolveEnvironmentUri";

  const {
    alt,
    src,
    onload: _onload,
    onerror: _onerror,
  }: HTMLImageElementProps = $props();

  const response = $derived(writable({ uri: src }));
  const isImageLoaded = $derived(writable(false));
</script>

<img
  use:disableTransitionOnComplete
  class:image-loaded={$isImageLoaded}
  src={$response.uri}
  {alt}
  onerror={(ev) => {
    resolveEnvironmentUri(src).then(response.set);
    _onerror?.(ev);
  }}
  onload={function (ev) {
    requestAnimationFrame(() => isImageLoaded.set(true));
    _onload?.(ev);
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
