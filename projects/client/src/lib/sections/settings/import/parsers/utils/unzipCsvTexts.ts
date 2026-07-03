import { unzipSync } from 'fflate';

interface UnzipCsvTextsParams {
  buffer: ArrayBuffer;
  isMatch: (basename: string) => boolean;
}

interface CsvText {
  basename: string;
  text: string;
}

export function unzipCsvTexts(
  { buffer, isMatch }: UnzipCsvTextsParams,
): CsvText[] {
  const unzipped = unzipSync(new Uint8Array(buffer), {
    filter: (file) => isMatch(file.name.split('/').at(-1) ?? ''),
  });

  const decoder = new TextDecoder('utf-8');
  return Object.entries(unzipped).map(([name, data]) => ({
    basename: name.split('/').at(-1) ?? '',
    text: decoder.decode(data),
  }));
}
