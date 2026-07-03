import { unzipSync } from 'fflate';

interface UnzipCsvTextsParams {
  buffer: ArrayBuffer;
  isMatch: (basename: string) => boolean;
}

export function unzipCsvTexts(
  { buffer, isMatch }: UnzipCsvTextsParams,
): string[] {
  const unzipped = unzipSync(new Uint8Array(buffer), {
    filter: (file) => isMatch(file.name.split('/').at(-1) ?? ''),
  });

  const decoder = new TextDecoder('utf-8');
  return Object.values(unzipped).map((data) => decoder.decode(data));
}
