/**
 * Write file with directory creation
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

export async function writeFile(
  filePath: string,
  content: string,
): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(filePath, content, 'utf-8');
}
