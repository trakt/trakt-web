export function setCacheBuster(url: URL) {
  const bustedUrl = new URL(url.href);
  const cacheBuster = Date.now();
  bustedUrl.searchParams.set('_cb', cacheBuster.toString());
  return bustedUrl;
}
