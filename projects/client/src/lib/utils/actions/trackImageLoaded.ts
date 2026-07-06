export type TrackImageLoadedProps = {
  src: string;
  onLoaded: (loaded: boolean) => void;
};

export function trackImageLoaded(
  node: HTMLImageElement,
  { onLoaded }: TrackImageLoadedProps,
) {
  let notify = onLoaded;

  // The browser does not refire `load` when a cached or unchanged src is
  // assigned, so reading `complete` is the only reliable signal. `naturalWidth`
  // guards against a completed-but-broken image.
  const sync = () => notify(node.complete && node.naturalWidth > 0);

  node.addEventListener('load', sync);
  node.addEventListener('error', sync);
  sync();

  return {
    update({ onLoaded }: TrackImageLoadedProps) {
      notify = onLoaded;
      // Runs after Svelte has flushed the new src to the element, so
      // `complete` reflects the current src.
      sync();
    },
    destroy() {
      node.removeEventListener('load', sync);
      node.removeEventListener('error', sync);
    },
  };
}
