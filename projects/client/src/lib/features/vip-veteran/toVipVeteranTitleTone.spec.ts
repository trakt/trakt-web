import { describe, expect, it } from 'vitest';
import { toVipVeteranTitleTone } from './toVipVeteranTitleTone.ts';

describe('util: toVipVeteranTitleTone', () => {
  it('should use the highest untitled rung for plain VIPs', () => {
    expect(toVipVeteranTitleTone(null)).to.equal('deep');
  });

  it('should use the highest rung that holds the title', () => {
    expect(toVipVeteranTitleTone('veteran')).to.equal('silver');
    expect(toVipVeteranTitleTone('legend')).to.equal('gold');
  });
});
