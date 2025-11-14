<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { PLACEHOLDERS } from "$lib/utils/constants";
  import { writable } from "svelte/store";
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
    variant = { type: "default" },
    ...rest
  }: ImageProps = $props();

  const response = $derived(writable({ uri: src }));
  const isImageLoaded = $derived(writable(false));

  const isPlaceholder = $derived(PLACEHOLDERS.includes(src));

  const style = $derived.by(() => {
    if (variant.type === "masked") {
      return `background-color: ${variant.color}; mask-image: url('${$response.uri}');`;
    }
    return "";
  });
</script>

<img
  {loading}
  class:image-loaded={$isImageLoaded}
  class:image-animation-enabled={animate}
  class:image-placeholder={isPlaceholder}
  class:has-mask={variant.type === "masked"}
  use:appendClassList={classList}
  src={$response.uri}
  {style}
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

    const shouldClearSrc =
      variant.type === "masked" && ev.target instanceof HTMLImageElement;

    if (shouldClearSrc) {
      ev.target.src = "";
    }
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

  img.has-mask {
    content-visibility: hidden;
    mask-size: contain;
    mask-mode: alpha;
    mask-repeat: no-repeat;
    mask-position: center;
  }
</style>
