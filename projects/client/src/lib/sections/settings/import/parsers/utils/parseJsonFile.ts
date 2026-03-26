export async function parseJsonFile(file: File): Promise<unknown> {
  const text = await file.text();
  return JSON.parse(text);
}
