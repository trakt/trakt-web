export function toMessageKey(prefix: string, value: string) {
  const valueKey = value
    .toLocaleLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/['()]+/g, '');

  return `${prefix}_${valueKey}` as const;
}
