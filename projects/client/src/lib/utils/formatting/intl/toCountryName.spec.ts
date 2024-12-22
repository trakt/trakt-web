import { describe, expect, it } from 'vitest';
import { toCountryName } from './toCountryName.ts';

describe('toCountryName', () => {
  it('will display United States', () => {
    const displayName = toCountryName('us', 'de');

    expect(displayName).toBe('Vereinigte Staaten');
  });

  it('will display アメリカ合衆国', () => {
    const displayName = toCountryName('us', 'ja');

    expect(displayName).toBe('アメリカ合衆国');
  });
});
