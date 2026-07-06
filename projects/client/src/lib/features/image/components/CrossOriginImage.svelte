<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { trackImageLoaded } from "$lib/utils/actions/trackImageLoaded.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { iffy } from "$lib/utils/function/iffy";
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

  let uri = $state(iffy(() => src));
  let isImageLoaded = $state(false);

  $effect(() => {
    uri = src;
  });

  const isPlaceholder = $derived(PLACEHOLDERS.includes(src));
</script>

<img
  {loading}
  decoding="async"
  class:image-loaded={isImageLoaded}
  class:image-animation-enabled={animate}
  class:image-placeholder={isPlaceholder}
  use:appendClassList={classList}
  use:trackImageLoaded={{ src: uri, onLoaded: (loaded) => (isImageLoaded = loaded) }}
  src={uri}
  {alt}
  onerror={(ev) => {
    resolveEnvironmentUri(src).then((next) => (uri = next.uri));
    _onerror?.(ev);
  }}
  onload={_onload}
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
