import type { ImportSource } from '../ImportTypes.ts';
import { ImdbParser } from './ImdbParser.ts';
import { LetterboxdParser } from './LetterboxdParser.ts';
import type { FileParser } from './ParserInterface.ts';
import { TraktCsvParser } from './TraktCsvParser.ts';
import { TraktJsonParser } from './TraktJsonParser.ts';
import { TvTimeCsvParser } from './TvTimeCsvParser.ts';

const PARSER_MAP: Record<ImportSource, FileParser> = {
  imdb: ImdbParser,
  letterboxd: LetterboxdParser,
  tvtime: TvTimeCsvParser,
  'trakt-csv': TraktCsvParser,
  'trakt-json': TraktJsonParser,
};

export function getParser(source: ImportSource): FileParser {
  return PARSER_MAP[source];
}
