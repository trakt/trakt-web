import { describe, expect, it } from 'vitest';
import { toDefaultServerId } from './toDefaultServerId.ts';

const server = (id: string, reachable: boolean) => ({
  id,
  name: id,
  owned: true,
  reachable,
});

describe('toDefaultServerId', () => {
  it('picks the only reachable server', () => {
    expect(toDefaultServerId([server('a', false), server('b', true)]))
      .to.equal('b');
  });

  it('leaves the choice to the user when several are reachable', () => {
    expect(toDefaultServerId([server('a', true), server('b', true)]))
      .to.equal(null);
  });

  it('picks nothing when no server is reachable', () => {
    expect(toDefaultServerId([server('a', false)])).to.equal(null);
  });
});
