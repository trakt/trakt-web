import { parseCsvText } from './parseCsvText.ts';

export async function parseCsvFile(file: File): Promise<unknown[]> {
  const text = await file.text();
  return parseCsvText(text);
}
