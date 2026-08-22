import { describe, expect, it } from 'vitest';
import { toExportStatusText } from './toExportStatusText.ts';

describe('util: toExportStatusText', () => {
  it('should name the section being fetched', () => {
    const text = toExportStatusText({
      status: { type: 'fetch', item: 'ratings-shows' },
      total: 48,
    });

    expect(text).to.contain('ratings-shows');
  });

  it('should describe the zipping phase', () => {
    const text = toExportStatusText({ status: { type: 'zip' }, total: 48 });

    expect(text).to.not.equal('');
    expect(text).to.not.contain('48');
  });

  it('should describe a clean export', () => {
    const text = toExportStatusText({
      status: { type: 'complete' },
      total: 48,
    });

    expect(text).to.not.equal('');
  });

  it('should use the singular copy for a lone failure', () => {
    const text = toExportStatusText({
      status: { type: 'partial', failed: 1 },
      total: 48,
    });

    expect(text).to.contain('1 of 48');
  });

  it('should use the plural copy when several sections fail', () => {
    const text = toExportStatusText({
      status: { type: 'partial', failed: 3 },
      total: 48,
    });

    expect(text).to.contain('3 of 48');
  });
});
