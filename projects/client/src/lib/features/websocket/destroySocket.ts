import { LogLevel, print } from '$lib/utils/console/print.ts';

export function destroySocket(socket: WebSocket | Nil) {
  if (socket) {
    try {
      socket.close();
    } catch (e) {
      print(LogLevel.Log, 'error', 'WS Error: Close Failed', e);
    }
  }
}
