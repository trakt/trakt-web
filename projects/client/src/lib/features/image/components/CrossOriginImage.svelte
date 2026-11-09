<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { trackImageLoaded } from "$lib/utils/actions/trackImageLoaded.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { iffy } from "$lib/utils/function/iffy";
  import { toImageFallbacks } from "../_internal/toImageFallbacks";
  import type { ImageProps } from "./ImageProps";
  import { resolveEnvironmentUri } from "./resolveEnvironmentUri";

  const {
    alt,
    src,
    fallback,
    loading = "lazy",
    animate = true,
    onload: _onload,
    onerror: _onerror,
    onmissing,
    classList = "",
    ...rest
  }: ImageProps = $props();

  let uri = $state(iffy(() => src));
  let sourceIndex = $state(0);
  let isImageLoaded = $state(false);

  const sources = $derived([
    ...new Set(
      [src, fallback, ...toImageFallbacks(src ?? "")].filter(
        (source): source is string => Boolean(source),
      ),
    ),
  ]);

  $effect(() => {
    uri = src;
    sourceIndex = 0;
  });

  const isPlaceholder = $derived(PLACEHOLDERS.includes(uri));

  const showNextSource = () => {
    sourceIndex += 1;
    const next = sources.at(sourceIndex);

    if (next) uri = next;
    if (!next || PLACEHOLDERS.includes(next)) onmissing?.();
  };

  const handleError: ImageProps["onerror"] = (ev) => {
    _onerror?.(ev);

    const failedSrc = src;
    const current = sources.at(sourceIndex) ?? "";

    resolveEnvironmentUri(current).then((next) => {
      if (failedSrc !== src) return;
      if (next.uri && next.uri !== uri) {
        uri = next.uri;
        return;
      }

      showNextSource();
    });
  };
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
  onerror={handleError}
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

    text-indent: -8008135px;
  }

  img.image-placeholder {
    background-color: var(--shade-800);
  }
</style>
