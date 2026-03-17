function resolveAllVars(svgString: string, context: Element): string {
  const style = getComputedStyle(context);

  const resolveVars = (str: string): string => {
    if (!str.includes('var(')) return str;
    const next = str.replace(
      /var\(([^()]+)\)/g,
      (_match, varExpr: string) => {
        const commaIdx = varExpr.indexOf(',');
        const varName = commaIdx >= 0
          ? varExpr.slice(0, commaIdx).trim()
          : varExpr.trim();
        const fallback = commaIdx >= 0 ? varExpr.slice(commaIdx + 1).trim() : '';
        return style.getPropertyValue(varName).trim() || fallback;
      },
    );
    return next === str ? str : resolveVars(next);
  };

  return resolveVars(svgString).replace(/currentColor/g, style.color);
}

export function toSvgBlob(container: Element): Blob | null {
  const svg = container.querySelector('svg');
  if (!svg) return null;

  const svgString = resolveAllVars(
    new XMLSerializer().serializeToString(svg),
    container,
  );

  return new Blob([svgString], { type: 'image/svg+xml' });
}
