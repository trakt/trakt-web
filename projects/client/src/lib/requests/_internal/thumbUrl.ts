export function thumbUrl(url: string | Nil): string | Nil {
  if (url == null) {
    return;
  }

  return url.replace('/medium/', '/thumb/');
}
