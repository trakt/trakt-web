<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { PLACEHOLDERS } from "$lib/utils/constants";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import type { ImageProps } from "./ImageProps";
  import { resolveEnvironmentUri } from "./resolveEnvironmentUri";

  const {
    alt,
    src,
    loading = "lazy",
    animate = true,
    onload: _onload,
    onerror: _onerror,
    classList = "",
    ...rest
  }: ImageProps = $props();

  const response = $derived(writable({ uri: src }));
  const isImageLoaded = $derived(writable(false));

  const isPlaceholder = $derived(PLACEHOLDERS.includes(src));
</script>

<img
  {loading}
  class:image-loaded={$isImageLoaded}
  class:image-animation-enabled={animate}
  class:image-placeholder={isPlaceholder}
  use:appendClassList={classList}
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
  {...rest}
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
    contain: content;
    content-visibility: auto;

    text-indent: -8008135px;
  }

  img.image-placeholder {
    background-color: var(--shade-800);
  }
</style>
