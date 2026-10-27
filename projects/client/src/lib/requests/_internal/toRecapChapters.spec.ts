import { describe, expect, it } from 'vitest';
import { toRecapChapters } from './toRecapChapters.ts';

describe('mapper: toRecapChapters', () => {
  it('should split the breakdown on its headings', () => {
    expect(
      toRecapChapters('## One\nFirst body.\n\n## Two\nSecond body.'),
    ).to.deep.equal([
      { key: 'recap-chapter-0', title: 'One', body: 'First body.' },
      { key: 'recap-chapter-1', title: 'Two', body: 'Second body.' },
    ]);
  });

  it('should keep a lower heading level inside the chapter body', () => {
    expect(toRecapChapters('## One\nIntro.\n### Detail\nMore.')).to.deep.equal([
      {
        key: 'recap-chapter-0',
        title: 'One',
        body: 'Intro.\n### Detail\nMore.',
      },
    ]);
  });

  it('should drop a chapter without a body', () => {
    expect(toRecapChapters('## Empty\n\n## Full\nBody.')).to.deep.equal([
      { key: 'recap-chapter-1', title: 'Full', body: 'Body.' },
    ]);
  });

  it('should ignore text before the first heading', () => {
    expect(toRecapChapters('Intro.\n## One\nBody.')).to.deep.equal([
      { key: 'recap-chapter-0', title: 'One', body: 'Body.' },
    ]);
  });

  it.each([undefined, null, '', 'No headings here.'])(
    'should return no chapters for %j',
    (expanded) => {
      expect(toRecapChapters(expanded)).to.deep.equal([]);
    },
  );
});
