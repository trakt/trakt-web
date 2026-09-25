/**
 * A reactive stand-in for `page.url` in specs that mock `$app/state`. Reading
 * `url` subscribes the caller's effects; `sync()` re-reads the browser location
 * after a spec changes it, the way a SvelteKit navigation would.
 */
export function createLocationState() {
  let href = $state(globalThis.location.href);

  return {
    get url() {
      return new URL(href);
    },
    sync: () => {
      href = globalThis.location.href;
    },
  };
}
