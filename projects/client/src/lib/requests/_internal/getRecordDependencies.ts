export function getRecordDependencies(
  params: Record<string, string | number | boolean> | Nil,
  whitelist?: string[],
): string[] {
  if (!params) {
    return [];
  }

  const dependencies: string[] = [];

  for (const key in params) {
    if (params[key] && (!whitelist || whitelist.includes(key))) {
      dependencies.push(`${key}=${params[key]}`);
    }
  }

  return dependencies;
}
