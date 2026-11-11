<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { trackImageLoaded } from "$lib/utils/actions/trackImageLoaded.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { iffy } from "$lib/utils/function/iffy";
  import { hasPosterLanguage } from "../_internal/hasPosterLanguage";
  import { posterLanguage } from "../_internal/posterLanguage";
  import { toImageFallbacks } from "../_internal/toImageFallbacks";
  import { toLocalizedPoster } from "../_internal/toLocalizedPoster";
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

  const localizedPoster = $derived(
    toLocalizedPoster({ url: src, language: posterLanguage() }),
  );

  const nativeLazyDistance = "1250px";

  let manifestPick = $state<{ src: string; poster: string }>();
  let isNearViewport = $state(false);
  const canAskManifest = $derived(loading === "eager" || isNearViewport);
  const needsViewportGate = $derived(
    Boolean(localizedPoster) && !canAskManifest,
  );
  const nearViewport = (element: HTMLImageElement) =>
    whenInViewport(element, {
      callback: () => (isNearViewport = true),
      rootMargin: nativeLazyDistance,
    }).destroy;

  $effect(() => {
    const poster = localizedPoster;
    const current = src;
    if (!poster || !current || !canAskManifest) return;

    let isCurrent = true;
    hasPosterLanguage(poster).then((exists) => {
      if (!isCurrent) return;
      manifestPick = { src: current, poster: exists ? poster.src : current };
    });

    return () => {
      isCurrent = false;
    };
  });

  const leadingSource = $derived.by(() => {
    if (!localizedPoster) return src;
    if (manifestPick?.src !== src) return null;

    return manifestPick.poster;
  });

  const sources = $derived(
    leadingSource === null
      ? []
      : [
          ...new Set(
            [
              leadingSource,
              src,
              fallback,
              ...toImageFallbacks(src ?? ""),
            ].filter((source): source is string => Boolean(source)),
          ),
        ],
  );

  let uri = $state(iffy(() => sources.at(0)));
  let sourceIndex = $state(0);
  let isImageLoaded = $state(false);

  $effect(() => {
    uri = sources.at(0);
    sourceIndex = 0;
  });

  const isPlaceholder = $derived(PLACEHOLDERS.includes(uri ?? ""));

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
  {@attach needsViewportGate ? nearViewport : undefined}
  use:trackImageLoaded={{
    src: uri ?? "",
    onLoaded: (loaded) => (isImageLoaded = loaded),
  }}
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
