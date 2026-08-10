import { browser } from '$app/environment';
import { createSocket } from './createSocket.ts';
import { destroySocket } from './destroySocket.ts';

export function createConnection(
  previous: WebSocket | Nil,
  token: string | Nil,
) {
  if (!browser) return;

  destroySocket(previous);

  if (!token) return;

  return createSocket(token);
}
