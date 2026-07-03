import { unzipSync } from 'fflate';

// Collects entry names without inflating any data (filter always rejects).
export function zipEntryBasenames(buffer: ArrayBuffer): string[] {
  const basenames: string[] = [];

  unzipSync(new Uint8Array(buffer), {
    filter: (file) => {
      basenames.push(file.name.split('/').at(-1) ?? '');
      return false;
    },
  });

  return basenames;
}
