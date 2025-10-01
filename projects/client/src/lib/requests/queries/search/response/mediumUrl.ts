export function mediumUrl(url: string | Nil): string | Nil {
  if (url == null) {
    return;
  }

  return url
    .replace('/thumb/', '/medium/')
    .replace('/original/', '/medium/');
}
