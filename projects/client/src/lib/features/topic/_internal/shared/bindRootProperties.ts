export function bindRootProperties(
  properties: Readonly<Record<string, string>>,
) {
  const style = document.documentElement.style;
  const entries = Object.entries(properties);

  entries.forEach(([name, value]) => style.setProperty(name, value));
  return () => entries.forEach(([name]) => style.removeProperty(name));
}
