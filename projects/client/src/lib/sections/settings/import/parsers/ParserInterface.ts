import type { UniversalImportItem } from '../ImportTypes.ts';

export interface FileParser {
  readonly name: string;
  canParse(files: ReadonlyArray<File>): boolean;
  parse(files: ReadonlyArray<File>): Promise<UniversalImportItem[]>;
}
