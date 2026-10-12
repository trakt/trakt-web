import { describe, expect, it } from 'vitest';
import { ClientStateKey } from './ClientStateKey.ts';

describe('ClientStateKey', () => {
  const keys = Object.values(ClientStateKey);

  it('should give every feature its own key', () => {
    expect(new Set(keys).size).to.equal(keys.length);
  });

  it('should only use keys the server accepts', () => {
    keys.forEach((key) => expect(key).to.match(/^[a-z][a-z0-9_]{0,63}$/));
  });
});
