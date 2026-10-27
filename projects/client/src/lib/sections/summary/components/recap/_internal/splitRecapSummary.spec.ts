import { describe, expect, it } from 'vitest';
import { splitRecapSummary } from './splitRecapSummary.ts';

describe('util: splitRecapSummary', () => {
  it('should lead with the first sentence of a single paragraph', () => {
    expect(
      splitRecapSummary(
        'Mark leads a team. Helly tries to escape. A plan unfolds.',
      ),
    ).to.deep.equal({
      lead: 'Mark leads a team.',
      rest: 'Helly tries to escape. A plan unfolds.',
    });
  });

  it('should not split inside an initial followed by a lowercase word', () => {
    expect(
      splitRecapSummary('New hire Helly R. attempts to escape. Then more.'),
    ).to.deep.equal({
      lead: 'New hire Helly R. attempts to escape.',
      rest: 'Then more.',
    });
  });

  it('should lead with the first paragraph when there are several', () => {
    expect(splitRecapSummary('One. Two.\n\nThree.\n\nFour.')).to.deep.equal({
      lead: 'One. Two.',
      rest: 'Three. Four.',
    });
  });

  it('should leave the rest empty for a single sentence', () => {
    expect(splitRecapSummary('Only one sentence here.')).to.deep.equal({
      lead: 'Only one sentence here.',
      rest: '',
    });
  });

  it('should lead with the whole paragraph when Intl.Segmenter is missing', () => {
    expect(splitRecapSummary(' One. Two. ', null)).to.deep.equal({
      lead: 'One. Two.',
      rest: '',
    });
  });

  it('should trim surrounding whitespace', () => {
    expect(splitRecapSummary('  Padded.  ')).to.deep.equal({
      lead: 'Padded.',
      rest: '',
    });
  });
});
