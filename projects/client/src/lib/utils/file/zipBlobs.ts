import { type Zippable, zip } from 'fflate';

type ZipEntry = {
  name: string;
  blob: Blob;
};

export async function zipBlobs(
  entries: ReadonlyArray<ZipEntry>,
): Promise<Blob> {
  const files: Zippable = Object.fromEntries(
    await Promise.all(
      entries.map(
        async ({ name, blob }) =>
          [name, new Uint8Array(await blob.arrayBuffer())] as const,
      ),
    ),
  );

  return new Promise((resolve, reject) => {
    zip(files, (error, data) => {
      if (error) return reject(error);
      resolve(new Blob([data as BlobPart], { type: 'application/zip' }));
    });
  });
}
