import { describe, expect, it } from 'vitest';
import { toVipVeteranTone } from './toVipVeteranTone.ts';

describe('util: toVipVeteranTone', () => {
  it('should keep the first two rungs purple', () => {
    expect(toVipVeteranTone(1)).to.equal('vip');
    expect(toVipVeteranTone(3)).to.equal('deep');
  });

  it('should colour the veteran and legend rungs', () => {
    expect(toVipVeteranTone(5)).to.equal('copper');
    expect(toVipVeteranTone(7)).to.equal('silver');
    expect(toVipVeteranTone(10)).to.equal('gold');
  });
});
