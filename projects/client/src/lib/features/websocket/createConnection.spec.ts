import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createConnection } from './createConnection.ts';
import { createSocket } from './createSocket.ts';

vi.mock('./createSocket.ts', () => ({
  createSocket: vi.fn(),
}));

function buildSocket() {
  const close = vi.fn();
  return { socket: { close } as unknown as WebSocket, close };
}

describe('createConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should close the previous socket when a token renews', () => {
    const previous = buildSocket();
    const next = buildSocket();
    vi.mocked(createSocket).mockReturnValue(next.socket);

    expect(createConnection(previous.socket, 'renewed')).to.equal(next.socket);
    expect(previous.close).toHaveBeenCalledOnce();
  });

  it('should close the previous socket when the token is cleared', () => {
    const previous = buildSocket();

    expect(createConnection(previous.socket, null)).to.equal(undefined);
    expect(previous.close).toHaveBeenCalledOnce();
    expect(createSocket).not.toHaveBeenCalled();
  });

  it('should open a socket when there is no previous connection', () => {
    const next = buildSocket();
    vi.mocked(createSocket).mockReturnValue(next.socket);

    expect(createConnection(null, 'token')).to.equal(next.socket);
    expect(createSocket).toHaveBeenCalledWith('token');
  });
});
