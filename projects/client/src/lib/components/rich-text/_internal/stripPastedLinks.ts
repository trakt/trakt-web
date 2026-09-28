export function stripPastedLinks(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelectorAll('a').forEach((anchor) =>
    anchor.replaceWith(...anchor.childNodes)
  );

  return document.body.innerHTML;
}
