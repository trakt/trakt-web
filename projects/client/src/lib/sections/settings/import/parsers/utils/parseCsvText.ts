export async function parseCsvText(text: string): Promise<unknown[]> {
  const Papa = await import('papaparse');
  const result = Papa.default.parse(text, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data as unknown[];
}
