import { describe, expect, it } from 'vitest';
import { toCommentBody } from './toCommentBody.ts';

describe('util: toCommentBody', () => {
  const gif = {
    url: 'https://static.klipy.com/ii/hash/ea/72/WGDcNWlt.gif',
    previewUrl: 'https://static.klipy.com/ii/hash/ea/72/iYDHVmEu.webp',
  };

  it('should return the trimmed text when there is no gif', () => {
    expect(toCommentBody({ text: '  what a ride  ', gif: null }))
      .toBe('what a ride');
  });

  it('should append the gif link below the text', () => {
    expect(toCommentBody({ text: 'what a ride', gif }))
      .toBe(`what a ride\n\n${gif.url}`);
  });

  it('should send the gif on its own when there is no text', () => {
    expect(toCommentBody({ text: '   ', gif })).toBe(gif.url);
  });

  it('should return an empty body when there is neither', () => {
    expect(toCommentBody({ text: '', gif: undefined })).toBe('');
  });
});
