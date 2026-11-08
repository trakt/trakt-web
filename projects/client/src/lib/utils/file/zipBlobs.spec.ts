import { unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { zipBlobs } from './zipBlobs.ts';

describe('util: zipBlobs', () => {
  it('should store every entry under its name', async () => {
    const zipped = await zipBlobs([
      { name: 'a.svg', blob: new Blob(['<svg/>']) },
      { name: 'b.svg', blob: new Blob(['<svg id="b"/>']) },
    ]);

    const files = unzipSync(new Uint8Array(await zipped.arrayBuffer()));

    expect(Object.keys(files)).toEqual(['a.svg', 'b.svg']);
    expect(new TextDecoder().decode(files['b.svg'])).toBe('<svg id="b"/>');
  });

  it('should label the archive as a zip', async () => {
    const zipped = await zipBlobs([{ name: 'a.txt', blob: new Blob(['a']) }]);

    expect(zipped.type).toBe('application/zip');
  });
});
