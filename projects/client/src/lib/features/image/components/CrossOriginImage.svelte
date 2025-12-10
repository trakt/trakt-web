<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { PLACEHOLDERS } from "$lib/utils/constants";
  import { BehaviorSubject } from "rxjs";
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

  const response = $derived(new BehaviorSubject({ uri: src }));
  const isImageLoaded = $derived(new BehaviorSubject(false));

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
    resolveEnvironmentUri(src).then((uri) => response.next(uri));
    _onerror?.(ev);
  }}
  onload={function (ev) {
    setTimeout(() => {
      isImageLoaded.next(true);
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
