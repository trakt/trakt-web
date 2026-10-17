type FileText = { basename: string; text: string };

type CollectFileTextsParams = {
  files: ReadonlyArray<File>;
  unzip: (buffer: ArrayBuffer) => FileText[];
};

export async function collectFileTexts(
  { files, unzip }: CollectFileTextsParams,
): Promise<FileText[]> {
  const entries = await Promise.all(files.map(async (file) => {
    if (file.name.endsWith('.zip')) {
      return unzip(await file.arrayBuffer());
    }
    return [{ basename: file.name, text: await file.text() }];
  }));

  return entries.flat();
}
