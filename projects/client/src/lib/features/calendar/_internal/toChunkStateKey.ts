import type { CalendarChunk } from '../models/CalendarChunk.ts';

type ToChunkStateKeyParams = {
  prefix: string;
  chunk: CalendarChunk;
};

export function toChunkStateKey({ prefix, chunk }: ToChunkStateKeyParams) {
  return `${prefix}:${chunk.key}`;
}
