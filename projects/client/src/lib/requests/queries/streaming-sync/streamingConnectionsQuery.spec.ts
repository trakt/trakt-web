import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { streamingConnectionsQuery } from './streamingConnectionsQuery.ts';

describe('streamingConnectionsQuery', () => {
  it('should map streaming connections preserving order', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(streamingConnectionsQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    const connections = result.data;

    expect(connections?.map((connection) => connection.id)).to.deep.equal([
      'hbomax',
      'amazon',
      'appletv',
      'netflix',
    ]);

    const prime = connections?.find((connection) => connection.id === 'amazon');
    expect(prime).to.include({
      name: 'Prime Video',
      isVip: true,
      isConnected: true,
      isActive: true,
      profile: 'Justin',
    });
    expect(prime?.lastSyncedAt).to.deep.equal(
      new Date('2025-05-28T14:51:00.000Z'),
    );

    const appleTv = connections?.find((connection) =>
      connection.id === 'appletv'
    );
    // black is a valid brand background and is preserved
    expect(appleTv?.color).to.equal('#000000');
    expect(appleTv?.isActive).to.equal(false);
  });
});
