import { SmartListSourceSchema } from '$lib/requests/models/SmartListSource.ts';
import { describe, expect, it } from 'vitest';
import { toSmartListSourceLabel } from './toSmartListSourceLabel.ts';

describe('toSmartListSourceLabel', () => {
  it('labels discover as all titles', () => {
    expect(toSmartListSourceLabel('discover')).to.equal('All titles');
  });

  it.each(SmartListSourceSchema.options)('labels %s', (source) => {
    expect(toSmartListSourceLabel(source))
      .to.be.a('string')
      .with.length.above(0);
  });
});
