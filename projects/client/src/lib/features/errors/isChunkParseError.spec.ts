import { describe, expect, it } from 'vitest';
import { isChunkParseError } from './isChunkParseError.ts';

const CHUNK_URL = 'https://app.trakt.tv/_app/immutable/nodes/84.CZyPsszp.js';

function syntaxError(
  message: string,
  source: { fileName?: string; stack?: string },
) {
  return Object.assign(new SyntaxError(message), source);
}

describe('util: isChunkParseError', () => {
  it('should flag a chunk that fails to parse in Firefox', () => {
    expect(
      isChunkParseError(
        syntaxError('missing ) after argument list', {
          fileName: CHUNK_URL,
          stack: '',
        }),
      ),
    ).toBe(true);
  });

  it('should flag a chunk that fails to parse when only the stack names it', () => {
    expect(
      isChunkParseError(
        syntaxError('Unexpected end of input', {
          stack: `SyntaxError: Unexpected end of input\n    at ${CHUNK_URL}:1:2048`,
        }),
      ),
    ).toBe(true);
  });

  it('should keep a failed JSON.parse thrown from our own code', () => {
    expect(
      isChunkParseError(
        syntaxError('JSON.parse: unexpected character at line 1 column 1', {
          fileName: CHUNK_URL,
        }),
      ),
    ).toBe(false);
    expect(
      isChunkParseError(
        syntaxError('Unexpected end of JSON input', {
          stack: `SyntaxError: Unexpected end of JSON input\n    at JSON.parse (<anonymous>)\n    at ${CHUNK_URL}:1:10`,
        }),
      ),
    ).toBe(false);
    expect(
      isChunkParseError(
        syntaxError('"<!doctype "... is not valid JSON', {
          fileName: CHUNK_URL,
        }),
      ),
    ).toBe(false);
  });

  it('should keep a syntax error from a script that is not ours', () => {
    expect(
      isChunkParseError(
        syntaxError('missing ) after argument list', {
          fileName: 'https://example.com/widget.js',
          stack: '',
        }),
      ),
    ).toBe(false);
  });

  it('should keep errors that are not syntax errors', () => {
    expect(
      isChunkParseError(
        Object.assign(new TypeError('x is undefined'), { fileName: CHUNK_URL }),
      ),
    ).toBe(false);
    expect(isChunkParseError('missing ) after argument list')).toBe(false);
  });
});
