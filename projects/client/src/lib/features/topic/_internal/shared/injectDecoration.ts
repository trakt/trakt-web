type InjectDecorationParams = {
  host: HTMLElement;
  className: string;
  markup?: string;
  prepend?: boolean;
};

export function injectDecoration({
  host,
  className,
  markup = '',
  prepend = false,
}: InjectDecorationParams) {
  const decoration = document.createElement('span');
  decoration.className = className;
  decoration.setAttribute('aria-hidden', 'true');
  decoration.innerHTML = markup;

  if (prepend) host.prepend(decoration);
  else host.append(decoration);

  return () => decoration.remove();
}
