export function writeJsonFile(
  filePath: string,
  data: Record<string, unknown>,
  options?: Deno.WriteFileOptions,
): Promise<void> {
  return Deno.writeTextFile(
    filePath,
    JSON.stringify(data, null, 2) + '\n',
    options,
  );
}
