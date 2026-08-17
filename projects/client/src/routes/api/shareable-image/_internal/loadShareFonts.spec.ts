import { describe, expect, it, vi } from 'vitest';

type LoadShareFonts = typeof import('./loadShareFonts.ts')['loadShareFonts'];
type Bucket = Parameters<LoadShareFonts>[0]['bucket'];

const REGULAR = 'assets/fonts/NotoSans-Regular.ttf';
const BOLD = 'assets/fonts/NotoSans-Bold.ttf';

async function freshLoader(): Promise<LoadShareFonts> {
  vi.resetModules();
  const { loadShareFonts } = await import('./loadShareFonts.ts');

  return loadShareFonts;
}

function bucketWith(paths: ReadonlyArray<string>) {
  const get = vi.fn((path: string) => {
    if (!paths.includes(path)) {
      return Promise.resolve(null);
    }

    return Promise.resolve({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });
  });

  return { get } as unknown as Bucket & { get: typeof get };
}

describe('util: loadShareFonts', () => {
  describe('when the bucket has both weights', () => {
    it('should return a regular and a bold face', async () => {
      const loadShareFonts = await freshLoader();

      const fonts = await loadShareFonts({
        bucket: bucketWith([REGULAR, BOLD]),
      });

      expect(fonts?.map((font) => font.weight)).toEqual([400, 700]);
    });

    it('should read each face only once across calls', async () => {
      const loadShareFonts = await freshLoader();
      const bucket = bucketWith([REGULAR, BOLD]);

      await loadShareFonts({ bucket });
      await loadShareFonts({ bucket });

      expect(bucket.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the fonts are unavailable', () => {
    it('should fall back when there is no bucket', async () => {
      const loadShareFonts = await freshLoader();

      const fonts = await loadShareFonts({ bucket: undefined });

      expect(fonts).toBeUndefined();
    });

    it('should fall back when a face is missing', async () => {
      const loadShareFonts = await freshLoader();

      const fonts = await loadShareFonts({ bucket: bucketWith([REGULAR]) });

      expect(fonts).toBeUndefined();
    });

    it('should retry on the next call rather than caching the failure', async () => {
      const loadShareFonts = await freshLoader();

      await loadShareFonts({ bucket: bucketWith([]) });
      const fonts = await loadShareFonts({
        bucket: bucketWith([REGULAR, BOLD]),
      });

      expect(fonts?.map((font) => font.weight)).toEqual([400, 700]);
    });
  });
});
