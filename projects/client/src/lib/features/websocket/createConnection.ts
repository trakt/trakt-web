import { browser } from '$app/environment';
import { createSocket } from './createSocket.ts';
import { destroySocket } from './destroySocket.ts';

export function createConnection(
  previous: WebSocket | Nil,
  token: string | null | undefined,
) {
  if (!browser) return;

  if (!token) {
    destroySocket(previous);
    return;
  }

  const connection = createSocket(token);

  return connection;
}
