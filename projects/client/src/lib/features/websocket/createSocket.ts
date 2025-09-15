import { LogLevel, print } from '$lib/utils/console/print.ts';

export function createSocket(token: string) {
  const url =
    `wss://db0xjc18bh.execute-api.us-east-1.amazonaws.com/prod?token=${
      encodeURIComponent(
        token,
      )
    }`;
  const socket = new WebSocket(url);

  socket.addEventListener('error', (event) => {
    print(LogLevel.Log, 'error', 'WS Error:', event);
  });

  return socket;
}
