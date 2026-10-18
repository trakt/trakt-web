import { writeFile } from 'node:fs/promises';

export function writeJsonFile(
  filePath: string,
  data: Record<string, unknown>,
): Promise<void> {
  return writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}
